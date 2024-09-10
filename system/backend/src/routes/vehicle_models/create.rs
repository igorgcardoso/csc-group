use axum::{
    debug_handler,
    extract::State,
    response::{IntoResponse, Response},
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::query;
use validator::Validate;

use crate::{errors::AppError, AppState};

#[derive(Deserialize, Validate)]
#[serde(rename_all = "camelCase")]
pub struct RequestBody {
    #[validate(length(min = 1))]
    pub name: String,
    pub manufacturer_id: i64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseBody {
    id: i64,
}

#[debug_handler]
pub async fn create(state: State<AppState>, body: Json<RequestBody>) -> Result<Response, AppError> {
    body.validate()?;

    if query!(
        "SELECT name FROM manufacturers WHERE id = ?",
        body.manufacturer_id
    )
    .fetch_optional(&state.pool)
    .await?
    .is_none()
    {
        return Err(AppError::BadRequest("Manufacturer not found".to_string()));
    }

    if query!("SELECT name FROM models WHERE name = ?", body.name)
        .fetch_optional(&state.pool)
        .await?
        .is_some()
    {
        return Err(AppError::BadRequest("Model already exists".to_string()));
    }

    let model = query!(
        r#"
        INSERT INTO models (name, manufacturer_id)
        VALUES (?, ?)
        RETURNING id
        "#,
        body.name,
        body.manufacturer_id
    )
    .fetch_one(&state.pool)
    .await?;

    Ok(Json(ResponseBody { id: model.id }).into_response())
}
