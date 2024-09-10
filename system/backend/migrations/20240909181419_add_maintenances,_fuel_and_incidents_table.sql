CREATE TABLE fuels (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
    vehicle_id INT NOT NULL,
    date DATE NOT NULL,
    quantity INTEGER NOT NULL,
    cost_per_unit INTEGER NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);

CREATE TABLE maintenances (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
    description TEXT NOT NULL,
    vehicle_id INT NOT NULL,
    date DATE NOT NULL,
    cost INTEGER NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);

CREATE TABLE incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
    description TEXT NOT NULL,
    trip_id INT NOT NULL,
    date DATE NOT NULL,
    cost INTEGER NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips (id)
);
