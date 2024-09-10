mod create;
mod list;

use serde::Serialize;

pub use self::{create::create, list::list};

use super::vehicle_models::Model;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Vehicle {
    pub id: i64,
    pub model: Model,
    pub year: i64,
    pub license_plate: String,
    pub status: String,
}
