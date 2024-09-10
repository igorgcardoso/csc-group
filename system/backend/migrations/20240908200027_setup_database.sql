CREATE TABLE manufacturers(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL
);
CREATE UNIQUE INDEX manufacturer_name_key ON manufacturers (name);

CREATE TABLE models(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    manufacturer_id INTEGER NOT NULL,
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX model_name_key ON models (name);

CREATE TABLE vehicles(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    model_id INTEGER NOT NULL,
    year INTEGER NOT NULL,
    license_plate TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX vehicle_license_plate_key ON vehicles (license_plate);

CREATE TABLE drivers(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    license TEXT NOT NULL
);
CREATE UNIQUE INDEX driver_license_key ON drivers (license);

CREATE TABLE routes(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    start TEXT NOT NULL,
    end TEXT NOT NULL
);
CREATE UNIQUE INDEX route_start_end_key ON routes (start, end);

CREATE TABLE trips(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    vehicle_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    route_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    number_of_passengers INTEGER NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
