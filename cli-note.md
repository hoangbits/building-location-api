➜  building-location-api git:(main) ✗ nest g module location
CREATE src/location/location.module.ts (85 bytes)
UPDATE src/app.module.ts (1011 bytes)
➜  building-location-api git:(main) ✗ nest g controller location
CREATE src/location/location.controller.spec.ts (506 bytes)
CREATE src/location/location.controller.ts (105 bytes)
UPDATE src/location/location.module.ts (182 bytes)
➜  building-location-api git:(main) ✗ nest g service location
CREATE src/location/location.service.spec.ts (474 bytes)
CREATE src/location/location.service.ts (92 bytes)
UPDATE src/location/location.module.ts (268 bytes)


## manage seed data



➜  building-location-api git:(main) nest g service seed --flat --no-spec
CREATE src/seed.service.ts (88 bytes)
UPDATE src/app.module.ts (1024 bytes)

➜  building-location-api git:(main) ✗ nest g module seed --flat --no-spec
CREATE src/seed.module.ts (81 bytes)
UPDATE src/app.module.ts (1084 bytes)
