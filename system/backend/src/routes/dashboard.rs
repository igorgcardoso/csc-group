use axum::{
    debug_handler,
    extract::State,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use sqlx::query_as;

use crate::{errors::AppError, AppState};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct DashboardResponse {
    passengers_by_month: Vec<PassengersByMonth>,
    fuel_by_month: Vec<FuelByMonth>,
    maintenance_by_month: Vec<MaintenanceByMonth>,
    incidents_by_month: Vec<IncidentsByMonth>,
    cost_by_month: Vec<CostByMonth>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CostByMonth {
    month: Option<String>,
    cost: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PassengersByMonth {
    month: Option<String>,
    count: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct FuelByMonth {
    month: Option<String>,
    quantity: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct MaintenanceByMonth {
    month: Option<String>,
    count: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct IncidentsByMonth {
    month: Option<String>,
    amount: i64,
}

#[debug_handler]
pub async fn dashboard(state: State<AppState>) -> Result<Response, AppError> {
    let passengers_by_month = query_as!(
        PassengersByMonth,
        r#"
        SELECT strftime('%Y-%m', start_time) as month, COUNT(*) as count
        FROM trips
        GROUP BY month
        "#
    )
    .fetch_all(&state.pool)
    .await?;

    let fuel_by_month = query_as!(
        FuelByMonth,
        r#"
        SELECT strftime('%Y-%m', date) as month, SUM(quantity) as quantity
        FROM fuels
        GROUP BY month
        "#
    )
    .fetch_all(&state.pool)
    .await?;

    let maintenance_by_month = query_as!(
        MaintenanceByMonth,
        r#"
        SELECT strftime('%Y-%m', date) as month, COUNT(*) as count
        FROM maintenances
        GROUP BY month
        "#
    )
    .fetch_all(&state.pool)
    .await?;

    let incidents_by_month = query_as!(
        IncidentsByMonth,
        r#"
        SELECT strftime('%Y-%m', date) as month, COUNT(*) as amount
        FROM incidents
        GROUP BY month
        "#
    )
    .fetch_all(&state.pool)
    .await?;

    let cost_by_month = query_as!(
        CostByMonth,
        r#"
        WITH cost_data AS (
            SELECT strftime('%Y-%m', date) as month, SUM(cost) as cost
            FROM maintenances
            GROUP BY month

            UNION ALL

            SELECT strftime('%Y-%m', date) as month, SUM(quantity * cost_per_unit) as cost
            FROM fuels
            GROUP BY month

            UNION ALL

            SELECT strftime('%Y-%m', date) as month, SUM(cost) as cost
            FROM incidents
            GROUP BY month
        )

        SELECT month, SUM(cost) as cost
        FROM cost_data
        GROUP BY month
        ORDER BY month;
        "#
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(DashboardResponse {
        passengers_by_month,
        fuel_by_month,
        maintenance_by_month,
        incidents_by_month,
        cost_by_month,
    })
    .into_response())
}
