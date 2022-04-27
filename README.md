![## Drafting Canvas](https://raw.githubusercontent.com/DavidIreland1/drafting-canvas/main/public/images/drafting-canvas.svg)

Drafting Canvas is a free real time collaborative design tool created as open source project

Try it out [draftingcanvas.com](https://www.draftingcanvas.com/)

## Development

### Development Environment Setup

Clone the repo

```console
git clone https://github.com/DavidIreland1/drafting-canvas.git
```

cd into the drafting-canvas folder

```console
cd drafting-canvas
```

Install dev dependencies

```console
npm install
```

Run the node web server

```console
npm run dev
```

Open on localhost  
[localhost:3001](http://localhost:3001/)

## Technology Stack

### UI created with:

-   [NextJS](https://nextjs.org/)
-   [React](https://reactjs.org/)
-   [Redux](https://redux.js.org/)
-   [Redux Toolkit](https://redux-toolkit.js.org/)

### Real time state sync between peer users with:

-   [redux-scuttlebutt](https://github.com/grrowl/redux-scuttlebutt) modified
-   [scuttlebutt](https://github.com/dominictarr/scuttlebutt)
-   [Primus](https://github.com/primus/primus)

### Hosting:

-   CDN: [AWS Amplify](https://aws.amazon.com/amplify/)
-   Domain: [AWS Route 53](https://aws.amazon.com/route53/)
-   Sockets: [AWS EC2](https://aws.amazon.com/ec2/) - In Progress
-   Storage: [AWS DynamodB](https://aws.amazon.com/dynamodb/) - In Progress
-   Image Storage: [AWS S3](https://aws.amazon.com/s3/) - In Progress

### Features:

-   [x] Real Time Collaboration
-   [x] Shareable Links
-   [x] Users on document
-   [x] HSBA color picker
-   [x] Rectangle shape
-   [x] Ellipse shape
-   [x] Shadow effects
-   [x] Sticky points
-   [x] Drag and drop tabs
-   [x] Structure panel
-   [x] Groups
-   [x] Solid fill
-   [x] Strokes
-   [x] Lockable elements
-   [x] Hidden elements
-   [x] Shadow effects
-   [x] Text
-   [x] Google Fonts
-   [x] Scroll bars

## Features Progress

[Trello](https://trello.com/invite/b/tAtFUG1o/837dc2a7dbb80ef8bd9c59add09e007f/drafting-canvas)

Contributions and feature suggestions very welcome!

Created by David Ireland
