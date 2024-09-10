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
    #[validate(length(min = 3))]
    pub name: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseBody {
    id: i64,
}

#[debug_handler]
pub async fn create(state: State<AppState>, body: Json<RequestBody>) -> Result<Response, AppError> {
    body.validate()?;

    let name = body.name.to_lowercase();

    if query!("SELECT name FROM manufacturers WHERE name = ?", name)
        .fetch_optional(&state.pool)
        .await?
        .is_some()
    {
        return Err(AppError::BadRequest(format!(
            "Manufacturer [{name}] already exists"
        )));
    }

    let manufacturer = query!(
        r#"
        INSERT INTO manufacturers (name)
        VALUES (?)
        RETURNING id
        "#,
        name,
    )
    .fetch_one(&state.pool)
    .await?;

    Ok(Json(ResponseBody {
        id: manufacturer.id,
    })
    .into_response())
}
