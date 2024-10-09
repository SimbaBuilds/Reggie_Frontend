#Project Overview
I am building a web applicaiton called Reggie that is a software product that will speed up workflows in the education admin space.
This is the front end of the application to be built in NextJS.
You will be using NextJS, as well as shadcn, tailwind, and lucid icon.
The backend is in python and it will handle all complex logic and database interactions.

If there is specific API documentation you need to complete a task, please ask for it instead of guessing.

#Core Functionalities

The public facing interface will include the following pages:

1. Landing page -- SEO optimized 
    a. Marketing notes: 
        i. “No 4 month lead time: have your records digitized as soon as you can scan them to yourself”
        ii. "No more jam-packed file rooms"
        iii. "After digitization: save hours of labor for your team with Reggie, your records manager and spreadsheet expert -- see demos below.
    b. Video demos of digitization and Reggie in action 
    c. Note: only compatible with Google Workspace and GSuite at the moment.  You will need to create a school managed google account if you don't have one.
    d. Pricing: Option 1 -- Digitize for $100.  Option 2 -- $50/mo. for Reggie assistant, digitization included.
    e. Login and sign up options

2. About page: "This digitization process was designed by Cameron Higtower, a former school Registrar and IT professional with a software engineering background.  This digitization process and "Reggie" assistant is simply a public version of the AI tools and processes that Cameron used on the job.
    a. Contact at bottom
    b. Link to demo page

3. Dedicated demo page showcasing digitization and Reggie in action
    a. "See Reggie's spreadsheet skills for yourself" -- users will be directed to the sign up and permissions pages -- then given instructions and examples for using his spreadsheet capabailities -- they will get 10 emails to Reggie without signing up for a plan  

4. FAQ page: 
    "How long does it take to scan files?":  "About 1 minute per person record"
    "How long after we scan will we have access to the digitized records": "Same day access"
    "Is this process FERPA compliant?":  "Yes, we have obtained all requried FERPA authorizations."
    "My records are already digitized -- can I still use Reggie": "Yes, but Reggie needs specific file organization and names.  Please contact support for details" 


The user portal aspect of the application will help the user navigate the following:

1. Digitize their school's paper records.  The set up process for digitization will include the following:
    a. A student list csv will be uploaded into the application with headers for student first name, last name, and date of birth -- a small AI will be used to map to correct headers to decrease need for user header naming precision
        i. Optionally, user uploads a staff list csv if they want to digitize and manage staff records
    b. For the scanning process, users will be given two options for file tagging:
        i. Use a consistent first page that contains person first, last, and DOB and provide a one sentence natural language description of where those items can be found on the page (for vision-enabled AI processing).
        ii. Obtain a downloadable pdf of cover pages from the application -- each of which can be placed on top of the person record so that the OCR or AI-vision model tool can properly process the record.  Note: Multiple sorting options will be given so that the page order matches the user's scanning order (A-Z/Z-A, By grade A-Z/Z-A).
    c. How-to content will be available for all of the above.
    d. A testing/trouble-shooting process will be built into the UI where the user uploads a person list csv and transcripts and tries scanning in 5 or so files using their chosen file tagging method
    e. The user can optionally upload a transcript batch report that will automatically populate student folders with their transcript -- student's first, last , and date of birth must be present on the first page of the transcript
2. Organize digitized records and upload to the cloud
3. Update the person roster via email to Reggie or via the application user interface.
4. Users will optionally be allowed to and be shown how to create an email alias for Reggie -- otherwise their email assistant will have an @simbabuilds email.
5. A dedicated page that shows how drive folders and records must be organized for Reggie records management to work 

#Backend Endpoints




#Current File Structure

REGGIE_FRONTEND
├── .next
├── app
│   ├── fonts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib
├── node_modules
├── requirements
│   └── frontend_instructions.md
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json