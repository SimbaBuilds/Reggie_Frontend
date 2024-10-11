
#Backend Endpoints

Here's the formatted markdown version of the endpoints:

1. User Authentication Endpoints:
   1. POST /api/auth/login
   2. POST /api/auth/signup
   3. POST /api/auth/logout
   4. GET /api/auth/user

2. Digitization Process Endpoints:
   1. POST /api/digitize/start
   2. GET /api/digitize/status
   3. POST @router.post("/upload/student-csv", response_model=CSVUploadResponse)
   4. POST @router.post("/upload/staff-csv", response_model=CSVUploadResponse)

3. Roster Management Endpoints:
   1. GET /api/roster/students
   2. GET /api/roster/staff
   3. POST /api/roster/update-students
   4. POST /api/roster/update-staff
   5. POST /api/roster/add-person
   6. DELETE /api/roster/remove-person

4. Email Templates Endpoints:
   1. GET /api/email-templates
   2. POST /api/email-templates
   3. PUT /api/email-templates/:id
   4. DELETE /api/email-templates/:id

5. File Management Endpoints:
   1. GET /api/files/:personId
   2. POST /api/files/upload
   3. DELETE /api/files/:fileId

6. Dashboard Statistics Endpoints:
   1. GET /api/stats/students-count
   2. GET /api/stats/staff-count
   3. GET /api/stats/templates-count

7. Cover Pages Endpoints:
   1. GET /api/cover-pages/generate
   2. POST /api/cover-pages/order

8. Reggie Assistant Endpoints:
   1. POST /api/assistant/query

9. Settings Endpoints:
   1. GET /api/settings
   2. PUT /api/settings