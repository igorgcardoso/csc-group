use axum::{
    debug_handler,
    extract::{Path, State},
    response::{IntoResponse, Response},
    Json,
};
use sqlx::query;

use crate::{errors::AppError, AppState};

#[debug_handler]
pub async fn delete(state: State<AppState>, id: Path<i64>) -> Result<Response, AppError> {
    if query!("SELECT id FROM manufacturers WHERE id = ?", *id)
        .fetch_optional(&state.pool)
        .await?
        .is_none()
    {
        return Err(AppError::BadRequest(format!("Manufacturer does not exist")));
    }

    query!(
        r#"
        DELETE FROM manufacturers
        WHERE id = ?
        "#,
        *id,
    )
    .execute(&state.pool)
    .await?;

    Ok(Json(()).into_response())
}
