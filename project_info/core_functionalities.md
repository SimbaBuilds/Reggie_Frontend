#Core Functionalities

The public facing interface will include the following pages:

1. Landing page -- SEO optimized 
    1. Marketing notes: 
        1. “No 4 month lead time: have your records digitized as soon as you can scan them to yourself”
        2. "No more jam-packed file rooms"
        3. "After digitization: save hours of labor for your team with Reggie, your records manager and spreadsheet expert -- see demos below.
    2. Video demos of digitization and Reggie in action 
    3. Note: only compatible with Google Workspace and GSuite at the moment.  You will need to create a school managed google account if you don't have one.
    4. Pricing: 
        1. Option 1 -- Digitize for $100.  
        2. Option 2 -- Reggie assistant for smaller organizations: $40/mo. For organizations with less than 500 people.  Includes Reggie assistant and digitization.
        3. Option 3 -- Reggie assistant for larger organizations: $80/mo. For organizations with 500+ people.  Includes Reggie assistant and digitization.
    5. Login and sign up options

2. About page: "This digitization process was designed by Cameron Higtower, a former school Registrar and IT professional with a software engineering background.  This digitization process and "Reggie" assistant is simply a public version of the AI tools and processes that Cameron used on the jo2.
    a. Contact at bottom
    2. Link to demos page

3. Dedicated demos page showcasing digitization and Reggie in action
    a. "See Reggie's spreadsheet skills for yourself" -- users will be directed to the sign up and permissions pages -- then given instructions and examples for using his spreadsheet capabailities -- they will get 10 emails to Reggie without signing up for a plan  

4. FAQ page: 
    "How long does it take to scan files?":  "About 1 minute per person record"
    "How long after we scan will we have access to the digitized records": "Same day access"
    "Is this process FERPA compliant?":  "Yes, we have obtained all requried FERPA authorizations."
    "My records are already digitized -- can I still use Reggie": "Yes, but Reggie needs specific file organization and names.  Please contact support for details" 


The user portal aspect of the application will help the user navigate the following:

1. Digitize their school's paper records.  The set up process for digitization will include the following:
    a. A student list csv will be uploaded into the application with headers for student first name, last name, and date of birth -- a small AI will be used to map to correct headers to decrease need for user header naming precision
        1. Optionally, user uploads a staff list csv if they want to digitize and manage staff records
    2. For the scanning process, users will be given two options for file tagging:
        1. Use a consistent first page that contains person first, last, and DOB and provide a one sentence natural language description of where those items can be found on the page (for vision-enabled AI processing).
        2. Obtain a downloadable pdf of cover pages from the application -- each of which can be placed on top of the person record so that the OCR or AI-vision model tool can properly process the record.  Note: Multiple sorting options will be given so that the page order matches the user's scanning order (A-Z/Z-A, By grade A-Z/Z-A).
    4. A testing/trouble-shooting process will be built into the UI where the user uploads a person list csv and transcripts and tries scanning in 5 or so files using their chosen file tagging method
    5. The user can optionally upload a transcript batch report that will automatically populate student folders with their transcript -- student's first, last , and date of birth must be present on the first page of the transcript
    6. If a users records are already digitized, option to organize (with Drive folder structure created for them) so that Reggie can use.

2. Organize digitized records and upload to the cloud
3. Update the person roster via email to Reggie or via the application user interface.
4. A space for users to upload their custom email templates 
5. Users will optionally be allowed to and be shown how to create an email alias for Reggie -- otherwise their email assistant will have an @simbabuilds email.
6. How-to content will be available for all of this.
7. Registration Process:
    1. Initial Registration:
        1. User provides basic information: name, email, and password.
        Selecting the sign up with google option will auto assign name, email, and password, but they will be prompted to complete the registration steps.
        2. User enters or registers their organization -- to rergister your organization select organization type (school, district, etc.) and size (small(<500) or large(500+)).
    2. Plan Selection:
    (If user has selected an organization that has already signed up for a plan, skip)
    Based on the organization size, recommend an appropriate plan.
    Explain the features of each plan, including the free tier limitations.
    3. Google Account Integration:
    User is prompted to connect their Google account for Drive and Gmail access.
    Explain the necessary permissions and why they're required (file storage, email automation).
    4. Data Upload:
    (If user's organization has already uploaded a csv, skip')
    User uploads a student list CSV (required) and an optional staff list CSV.
    Implement the AI model to map headers, reducing the need for precise naming.
    5. Google Drive Setup:
    Backend creates the specified folder structure in the user's Google Drive.
    Confirm successful creation and provide a brief overview of the structure.
    Digitization Preferences:
    6. User selects their preferred method for identifying persons in records:
    a. "Consistent first page" option with a natural language description.
    b. "Cover page" option using OCR.
    If records are already digitized, offer the manual organization option.
    7. Email Configuration:
    Email labels created for them via the API. 
    Digitization only customers only get the cumulative file label. 
    Explain each label's purpose and how to use them.
    8. Transcript Handling:
    1. (Optional -- subscription service only)
    2. "Upload a batch report of your current students' transcripts below.
        This will allow Reggie to add your students' transcripts to their records folder and fetch the transcript during automated email drafts of records request fulfillments. 
        Students' first name, last name, and date of birth must be present on the first page of each transcript.
        Your SIS should have a transcript batch report tool. 
        Upload as one large pdf with 1-2 students per page.
        Note: This must be done once per semester."
    9. Template Responses:
        1. Skip for digitization only customers.
        2. "These email templates can be related to anything: enrollment info, transcript requests, course catalogs, etc.."
            E.g.
            Subject: Transcript Request Confirmation
            Dear [Student/Parent Name],
            We have received your request for a transcript. Please allow [X] business days for processing. If you need further assistance, feel free to contact our office.
            Best regards,
            [Registrar’s Name]
            High School Registrar
        3. Allow the user to set up initial email templates (up to 8) or skip for later.
    10. User Accounts:
        (If user is not the primary user in organization, skip)
        For paid plans, allow the primary user to invite up to 4 additional users (max 5 per organization).
    11. Onboarding Tutorial:
        (Differentiate based on plan)
        Provide a brief interactive tutorial on how to use key features like email labels, Reggie interactions, and accessing digitized records.
    12. All pages above should have a progress bar for this entire process 
    13. Confirmation and Next Steps:
        Summarize the setup process and provide clear next steps for getting started.
        Offer resources for further assistance and support.
    