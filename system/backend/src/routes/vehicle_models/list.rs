use axum::{
    debug_handler,
    extract::State,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use sqlx::query;

use crate::{errors::AppError, routes::manufacturers::Manufacturer, AppState};

use super::Model;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseBody {
    models: Vec<Model>,
}

#[debug_handler]
pub async fn list(state: State<AppState>) -> Result<Response, AppError> {
    let models = query!(
        r#"
        SELECT mo.id, mo.name, ma.id as manufacturer_id, ma.name as manufacturer_name
        FROM models mo
        JOIN manufacturers ma ON mo.manufacturer_id = ma.id
        ORDER BY mo.name;
        "#,
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(ResponseBody {
        models: models
            .iter()
            .map(|model| Model {
                id: model.id,
                name: model.name.clone(),
                manufacturer: Manufacturer {
                    id: model.manufacturer_id,
                    name: model.manufacturer_name.clone(),
                },
            })
            .collect(),
    })
    .into_response())
}
