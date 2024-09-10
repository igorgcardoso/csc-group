use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use thiserror::Error;
use tracing::error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("{0}")]
    BadRequest(String),
    #[error("{0}")]
    UnprocessableEntity(String),
    #[error("Internal Server Error")]
    InternalServerError,
}

impl From<validator::ValidationErrors> for AppError {
    fn from(err: validator::ValidationErrors) -> Self {
        AppError::UnprocessableEntity(err.to_string())
    }
}

impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        error!("{}", err.to_string());

        AppError::InternalServerError
    }
}

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    message: String,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        match self {
            AppError::BadRequest(_) => (
                StatusCode::BAD_REQUEST,
                Json(ErrorResponse {
                    message: self.to_string(),
                }),
            ),
            AppError::UnprocessableEntity(_) => (
                StatusCode::UNPROCESSABLE_ENTITY,
                Json(ErrorResponse {
                    message: self.to_string(),
                }),
            ),
            AppError::InternalServerError => (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    message: self.to_string(),
                }),
            ),
        }
        .into_response()
    }
}
