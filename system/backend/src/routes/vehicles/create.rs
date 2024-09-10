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
    pub model_id: i64,
    year: i32,
    #[validate(length(min = 7))]
    license_plate: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseBody {
    id: i64,
}

#[debug_handler]
pub async fn create(state: State<AppState>, body: Json<RequestBody>) -> Result<Response, AppError> {
    body.validate()?;

    let model = query!(
        r#"
        SELECT id FROM models WHERE id = ?
        "#,
        body.model_id
    )
    .fetch_optional(&state.pool)
    .await?;

    if model.is_none() {
        return Err(AppError::BadRequest("Model not found".to_string()));
    }

    if query!(
        "SELECT id FROM vehicles WHERE license_plate = ?",
        body.license_plate
    )
    .fetch_optional(&state.pool)
    .await?
    .is_some()
    {
        return Err(AppError::BadRequest(
            "License plate already exists".to_string(),
        ));
    }

    let vehicle = query!(
        r#"
        INSERT INTO vehicles (model_id, year, license_plate)
        VALUES (?, ?, ?)
        RETURNING id
        "#,
        body.model_id,
        body.year,
        body.license_plate
    )
    .fetch_one(&state.pool)
    .await?;

    Ok(Json(ResponseBody { id: vehicle.id }).into_response())
}
