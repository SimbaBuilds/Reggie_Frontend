#Project Overview
I am building a web applicaiton called Reggie that is a software product that will speed up workflows in the education admin space.
This is the front end of the applicaiton built in NextJS.
Marketing quotes:
"No more jam-packed file rooms"
“No 4 month lead time: have your records digitized as soon as you can scan them to yourself”


#Core Functionalities
The front end of the application will help the user navigate the follwing:
1. Digitize their school's paper records.  The set up process for digitization will include the following:
    a. A student list csv will be uploaded into the application with headers for student first name, last name, and date of birth -- a small AI will be used to map to correct headers to decrease need for user header naming precision
        i. Optionally, user uploads a staff list csv if they want to digitize and manage staff records
    b. For the scanning process, users will be given two options for file tagging:
        i. Use a consistent first page that contains person first, last, and DOB and provide a one sentence natural language description of where those items can be found on the page (for vision-enabled AI processing).
        ii. Obtain a downloadable pdf of cover pages from the application -- each of which can be placed on top of the person record so that the OCR or AI-vision model tool can properly process the record.  Note: Multiple sorting options will be given so that the page order matches the user's scanning order (A-Z/Z-A, By grade A-Z/Z-A).
    c. How-to content will be available for all of the above.
    d. A testing/trouble-shooting process will be built into the UI where the user uploads a person list csv and transcripts and tries scanning in 5 or so files using their chosen file tagging method
    e. The user can optionally upload a transcript batch report that will automatically populate student folders with their transcript -- student's first, last , and date of birth must be present on the first page of the transcript
2. Organize and upload digitized records to the cloud
3. A series of email assistant automations will be set up for the customer.  Implementation of this functionality will be handled in the back end of the application.
4. Users will need to update the person roster via email to Reggie or via the applicaiton user interface.
5. The application will be compatible with only Google Workspace and GSuite to start out.
6. Pricing: Option 1 -- Digitize only for $100.  Option 2 -- $50 for automation features, digitization included.
7. Users will optionally be allowed to and be shown how to create an email alias for Reggie -- otherwise their email assistant will have an @simbabuilds email.
8. FAQ page: 
    "How long does it take to scan files?":  "About 1 minute per person record"
    "How long after we scan will we have access to the digitized records": "Same day access"
    "Is this process FERPA compliant?":  "Yes, we have obtained all requried FERPA authorizations."



#Docs
NextJS, shadcn/v0 for styling, Clerk for Auth, Stripe for payments


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