use axum::{
    debug_handler,
    extract::State,
    response::{IntoResponse, Response},
    Json,
};
use chrono::prelude::*;
use fake::Fake;
use rand::prelude::*;

use crate::{errors::AppError, AppState};

#[debug_handler]
pub async fn populate_db(state: State<AppState>) -> Result<Response, AppError> {
    let mut rng = StdRng::from_entropy();
    let num_manufacturers_to_add: usize = rng.gen_range(10..20);
    let mut manufacturer_ids = Vec::new();
    let pool = state.pool.clone();
    for _ in 0..num_manufacturers_to_add {
        let name = fake::faker::company::en::CompanyName().fake::<String>();
        let manufacturer = sqlx::query!(
            r#"
            INSERT INTO manufacturers (name)
            VALUES (?);
            "#,
            name,
        )
        .execute(&pool)
        .await;

        if let Ok(manufacturer) = manufacturer {
            manufacturer_ids.push(manufacturer.last_insert_rowid());
        }
    }

    let num_vehicle_models_to_add: usize = rng.gen_range(10..50);
    let mut vehicle_model_ids = Vec::new();
    for _ in 0..num_vehicle_models_to_add {
        let name = fake::faker::lorem::en::Word().fake::<String>();
        let manufacturer_id = manufacturer_ids.choose(&mut rng).unwrap();
        let vehicle_model = sqlx::query!(
            r#"
            INSERT INTO models (name, manufacturer_id)
            VALUES (?, ?)
            "#,
            name,
            manufacturer_id,
        )
        .execute(&state.pool)
        .await;

        if let Ok(vehicle_model) = vehicle_model {
            vehicle_model_ids.push(vehicle_model.last_insert_rowid());
        }
    }

    let num_vehicles_to_add: usize = rng.gen_range(100..1000);
    let mut vehicle_ids = Vec::new();
    let status = vec!["active", "inactive", "maintenance", "broken"];
    for _ in 0..num_vehicles_to_add {
        let model_id = vehicle_model_ids.choose(&mut rng).unwrap();
        let year = rng.gen_range(1990..2023);
        let license_plate = fake::faker::automotive::fr_fr::LicencePlate().fake::<String>();
        let vehicle_status = status.choose(&mut rng).unwrap();

        let vehicle = sqlx::query!(
            r#"
            INSERT INTO vehicles (model_id, year, license_plate, status)
            VALUES (?, ?, ?, ?)
            "#,
            model_id,
            year,
            license_plate,
            vehicle_status,
        )
        .execute(&state.pool)
        .await;

        if let Ok(vehicle) = vehicle {
            vehicle_ids.push(vehicle.last_insert_rowid());
        }
    }

    let num_drivers_to_add: usize = rng.gen_range(10..num_vehicles_to_add);
    let mut driver_ids = Vec::new();
    for _ in 0..num_drivers_to_add {
        let name = fake::faker::name::en::Name().fake::<String>();
        let phone_number = fake::faker::phone_number::en::PhoneNumber().fake::<String>();
        let license = fake::faker::lorem::en::Word().fake::<String>();
        let driver = sqlx::query!(
            r#"
            INSERT INTO drivers (name, phone, license)
            VALUES (?, ?, ?)
            "#,
            name,
            phone_number,
            license,
        )
        .execute(&state.pool)
        .await;

        if let Ok(driver) = driver {
            driver_ids.push(driver.last_insert_rowid());
        }
    }

    let num_routes_to_add: usize = rng.gen_range(500..5000);
    let mut route_ids = Vec::new();
    for _ in 0..num_routes_to_add {
        let start = fake::faker::address::en::StreetName().fake::<String>();
        let end = fake::faker::address::en::StreetName().fake::<String>();
        let route = sqlx::query!(
            r#"
            INSERT INTO routes (start, end)
            VALUES (?, ?)
            "#,
            start,
            end,
        )
        .execute(&state.pool)
        .await;

        if let Ok(route) = route {
            route_ids.push(route.last_insert_rowid());
        }
    }

    let num_trips_to_add: usize = rng.gen_range(1000..10000);
    let mut trip_ids = Vec::new();
    for _ in 0..num_trips_to_add {
        let vehicle_id = vehicle_ids.choose(&mut rng).unwrap();
        let driver_id = driver_ids.choose(&mut rng).unwrap();
        let route_id = route_ids.choose(&mut rng).unwrap();
        let start_time = fake::faker::chrono::en::DateTimeBetween(
            NaiveDateTime::parse_from_str("2024-01-01 00:00:00", "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            Local::now().to_utc(),
        )
        .fake::<String>();
        let end_time = fake::faker::chrono::en::DateTimeBetween(
            NaiveDateTime::parse_from_str(&start_time, "%Y-%m-%dT%H:%M:%S+00:00")
                .unwrap()
                .and_utc(),
            Local::now().to_utc(),
        )
        .fake::<String>();
        let number_of_passengers = rng.gen_range(1..100);

        let trip = sqlx::query!(
            r#"
            INSERT INTO trips (vehicle_id, driver_id, route_id, start_time, end_time, number_of_passengers)
            VALUES (?, ?, ?, ?, ?, ?)
            "#,
            vehicle_id,
            driver_id,
            route_id,
            start_time,
            end_time,
            number_of_passengers,
        )
        .execute(&state.pool)
        .await;

        if let Ok(trip) = trip {
            trip_ids.push(trip.last_insert_rowid());
        }
    }

    let num_maintenances_to_add: usize = rng.gen_range(100..1000);
    for _ in 0..num_maintenances_to_add {
        let vehicle_id = vehicle_ids.choose(&mut rng).unwrap();
        let date = fake::faker::chrono::en::DateTimeBetween(
            NaiveDateTime::parse_from_str("2024-01-01 00:00:00", "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            Local::now().to_utc(),
        )
        .fake::<String>();
        let description = fake::faker::lorem::en::Paragraph(3..10).fake::<String>();
        let cost = rng.gen_range(10..1000);

        sqlx::query!(
            r#"
            INSERT INTO maintenances (vehicle_id, date, description, cost)
            VALUES (?, ?, ?, ?)
            "#,
            vehicle_id,
            date,
            description,
            cost,
        )
        .execute(&state.pool)
        .await
        .ok();
    }

    let num_fuelings_to_add: usize = rng.gen_range(1000..10000);
    for _ in 0..num_fuelings_to_add {
        let vehicle_id = vehicle_ids.choose(&mut rng).unwrap();
        let date = fake::faker::chrono::en::DateTimeBetween(
            NaiveDateTime::parse_from_str("2024-01-01 00:00:00", "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            Local::now().to_utc(),
        )
        .fake::<DateTime<Utc>>()
        .date_naive()
        .to_string();
        let liters = rng.gen_range(10..100);
        let cost = rng.gen_range(10..1000);

        sqlx::query!(
            r#"
            INSERT INTO fuels (vehicle_id, date, quantity, cost_per_unit)
            VALUES (?, ?, ?, ?)
            "#,
            vehicle_id,
            date,
            liters,
            cost,
        )
        .execute(&state.pool)
        .await
        .ok();
    }

    let num_incidents_to_add: usize = rng.gen_range(100..1000);
    for _ in 0..num_incidents_to_add {
        let trip_id = trip_ids.choose(&mut rng).unwrap();
        let date = fake::faker::chrono::en::DateTimeBetween(
            NaiveDateTime::parse_from_str("2024-01-01 00:00:00", "%Y-%m-%d %H:%M:%S")
                .unwrap()
                .and_utc(),
            Local::now().to_utc(),
        )
        .fake::<String>();
        let description = fake::faker::lorem::en::Paragraph(3..10).fake::<String>();
        let cost = rng.gen_range(10..1000);

        sqlx::query!(
            r#"
            INSERT INTO incidents (trip_id, date, description, cost)
            VALUES (?, ?, ?, ?)
            "#,
            trip_id,
            date,
            description,
            cost,
        )
        .execute(&state.pool)
        .await
        .ok();
    }

    Ok(Json(()).into_response())
}
