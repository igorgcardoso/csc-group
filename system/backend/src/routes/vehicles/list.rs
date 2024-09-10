use axum::{
    debug_handler,
    extract::State,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use sqlx::query;

use crate::{errors::AppError, routes::manufacturers::Manufacturer, AppState};

use super::{Model, Vehicle};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseBody {
    vehicles: Vec<Vehicle>,
}

#[debug_handler]
pub async fn list(state: State<AppState>) -> Result<Response, AppError> {
    let vehicles = query!(
        r#"
        SELECT v.id, v.year, v.license_plate, v.status, mo.id as model_id, mo.name as model_name, ma.id as manufacturer_id, ma.name as manufacturer_name
        FROM vehicles v
        JOIN models mo ON v.model_id = mo.id
        JOIN manufacturers ma ON mo.manufacturer_id = ma.id
        ORDER BY v.license_plate;
        "#,
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(ResponseBody {
        vehicles: vehicles
            .iter()
            .map(|vehicle| Vehicle {
                id: vehicle.id,
                year: vehicle.year,
                license_plate: vehicle.license_plate.clone(),
                status: vehicle.status.clone(),
                model: Model {
                    id: vehicle.model_id,
                    name: vehicle.model_name.clone(),
                    manufacturer: Manufacturer {
                        id: vehicle.manufacturer_id,
                        name: vehicle.manufacturer_name.clone(),
                    },
                },
            })
            .collect(),
    })
    .into_response())
}
