use axum::{
    routing::{delete, get, post},
    Router,
};
use sqlx::sqlite::SqlitePool;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing::info;

mod errors;
mod routes;

#[derive(Clone)]
pub struct AppState {
    pool: SqlitePool,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_max_level(
            #[cfg(debug_assertions)]
            tracing::Level::DEBUG,
            #[cfg(not(debug_assertions))]
            tracing::Level::INFO,
        )
        .init();
    dotenvy::dotenv().ok();

    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = SqlitePool::connect(&db_url).await?;

    sqlx::migrate!().run(&pool).await?;

    let state = AppState { pool };

    let app = Router::new()
        .route(
            "/vehicles",
            post(routes::vehicles::create).get(routes::vehicles::list),
        )
        .route(
            "/manufacturers",
            post(routes::manufacturers::create).get(routes::manufacturers::list),
        )
        .route("/manufacturers/:id", delete(routes::manufacturers::delete))
        .route(
            "/vehicle-models",
            post(routes::vehicle_models::create).get(routes::vehicle_models::list),
        )
        .route(
            "/vehicle-models/:id",
            delete(routes::vehicle_models::delete),
        )
        .route("/populate-db", post(routes::populate_db::populate_db))
        .route("/dashboard", get(routes::dashboard::dashboard))
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addrs = "0.0.0.0:8080";
    let listener = tokio::net::TcpListener::bind(addrs).await?;
    info!("Listening on http://{}", addrs);
    axum::serve(listener, app.into_make_service()).await?;

    Ok(())
}
