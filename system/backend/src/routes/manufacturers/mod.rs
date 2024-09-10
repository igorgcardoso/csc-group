use serde::Serialize;

mod create;
mod delete;
mod list;

pub use self::{create::create, delete::delete, list::list};

#[derive(Debug, Serialize)]
pub struct Manufacturer {
    pub id: i64,
    pub name: String,
}
