
#Backend Endpoints

User Authentication Endpoints:

POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
GET /api/auth/user

Digitization Process Endpoints:

POST /api/digitize/start
GET /api/digitize/status
POST /api/upload/student-csv
POST /api/upload/staff-csv

Roster Management Endpoints:

GET /api/roster/students
GET /api/roster/staff
POST /api/roster/update-students
POST /api/roster/update-staff
POST /api/roster/add-person
DELETE /api/roster/remove-person

Email Templates Endpoints:

GET /api/email-templates
POST /api/email-templates
PUT /api/email-templates/:id
DELETE /api/email-templates/:id

File Management Endpoints:

GET /api/files/:personId
POST /api/files/upload
DELETE /api/files/:fileId

Dashboard Statistics Endpoints:

GET /api/stats/students-count
GET /api/stats/staff-count
GET /api/stats/templates-count

Cover Pages Endpoints:

GET /api/cover-pages/generate
POST /api/cover-pages/order

Reggie Assistant Endpoints:

POST /api/assistant/query

Settings Endpoints:

GET /api/settings
PUT /api/settings