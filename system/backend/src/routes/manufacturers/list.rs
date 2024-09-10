use axum::{
    debug_handler,
    extract::State,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use sqlx::query;

use crate::{errors::AppError, AppState};

use super::Manufacturer;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseBody {
    manufacturers: Vec<Manufacturer>,
}

#[debug_handler]
pub async fn list(state: State<AppState>) -> Result<Response, AppError> {
    let manufacturers = query!(
        r#"
        SELECT id, name
        FROM manufacturers
        ORDER BY name;
        "#,
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(ResponseBody {
        manufacturers: manufacturers
            .iter()
            .map(|manufacturer| Manufacturer {
                id: manufacturer.id,
                name: manufacturer.name.clone(),
            })
            .collect(),
    })
    .into_response())
}
