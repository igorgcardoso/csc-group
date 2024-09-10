mod create;
mod delete;
mod list;

use serde::Serialize;

pub use self::{create::create, delete::delete, list::list};

use super::manufacturers::Manufacturer;

#[derive(Debug, Serialize)]
pub struct Model {
    pub id: i64,
    pub name: String,
    pub manufacturer: Manufacturer,
}
