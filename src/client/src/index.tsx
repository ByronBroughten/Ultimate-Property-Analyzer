import { AppRegistry } from "react-native";
import App from "./App";

AppRegistry.registerComponent("App", () => App);
AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
// Put info dots on output labels

// Create a value called "extraLoanCosts"
// (this is kind of needed, you have found)
// You could use a similar value for the "custom"
// loan cost editor
// - simple, enter amount or itemize

// Add homebuyer variables
// (not necessary, but easy)
// - likeability
// - purchase price per likability
// - upfrontInvestment
// - monthlyHousingBudget

// Implement archive and make it skip loading archived deals
// (this is needed for increasing speed)
// - Create a route for fetching archived deals
// - Add the archive button
// - Add the unarchive button

// (you really do need these tests to uncover any numerical errors)
// Make property tests include brrrr and homeBuyer
// Add tests for refiFinancing
// Add tests for mgmt

// Launch

// - make SolverSections test suite to test the reducer actions

// Let deal compare metrics load from outputLists

// Add an easy CapEx default for homebuyer mode (1% or 2% purchase price)
// Re-add an easy CapEx default for buyAndHold and brrrr (20% rent)
// Taylor the maintenance defaults for homebuyer mode
// Is there an easy utilities default homeBuyer?

// Other deal compare features
// - save outputList
// - load outputList

// - restrict editing to only the n most recent deals
// - Make output lists customizable
// - Add passFail outputs
// - Add customVariables to property
// - Add public housing data api

// Add the following
// - Appreciation (property—particularly good for homebuyer)
// - Income increase (property)
// - Expense increase/inflation (property maintenance and mgmt)
// - Optional Selling Costs for buyAndHold
// - Total interest paid (good for homeBuyer)

// - add pass or fail variables
// - integrate pass or fail into the outputList

// 70% Rule
// - Implement dealMode outputs lists

// what if each switchVarb was its own section
// the section would have

// New Loan situation
// - rethink completionStatus?

// - Figure out how to display two values under one label,
//   with a light grey divider in between them (or just one value
//   if only one is provided)

// - Figure out how to display everything when purchasePrice & repairs
//   is selected

// Now, how do I handle the problem of being able to use
// loans both for the purchase and refinance phase?

// 1. Leave things basically as they are—loans are flexible and
//    have all three options no matter what. Whatever is entered is entered,
//    even if it doesn't really make sense to have ARV in the purchase phase

// 3. Make loans just have "percent of price". When they're
//    in the refinance slot, it's from ARV. When they're in the purchase
//    slot, it's from purchasePrice

// - Add FixNFlip
// Add the necessary inputs
// * After Repair Value

// Purchase Loan
// Down payment or Loan Amount
// Loan amount method
//  % of Purchase Price
//  % of Rehab Costs
//  % Price and Rehab Costs

// DollarAmount

// Create a separate sectionValue for each of those
// downPayment % or loanAmount %

// purchasePriceLoanAmount

// - Probably factor repairs into loans
// - Also factor in downPayments
// Add the necessary outputs
// Create default a default output list for each
// Add overrides to the component completionStatuses

// Add multiple units at once
// Add optional description information to property (parking, lot size, zoning, MLS number?, notes)
// Display units in groups of like units (2) Unit Info; (1) Unit Info;
// Add a unit label?
// Add unit sqft?
// Add "property type" to property, to open up different fields
// Add a full address to properties? (Street, city, state, zipcode) with autofill
// Add tags to deals?
// Add a short description to deals?

//  - Copy DealCheck
//   - Add ARV
//   - Add holding period
//   - Add holding costs
//     - Holding utilities
//     - Holding misc
//   - Add cost overrun
//   - Contractor management costs for mgmt?

// Add more differentiating stats for Financing and Property
// Add address for property
// Maybe add a way to load property right from deal menu

// - Add empty dbChildIds to DbStore, to control the orders of components
//   - They'll likely be pretty easy to update, later.

// - Possibly give price, taxes, and insurance valueSections, and
// any other pure inputs, to future proof your ability to incorporate
// api modes

// - Figure out if there's a way to use mui sx with mobile

// How should I handle the loan being able to cover repair costs?
// DealCheck uses two boxes for that.
// - Financed repair cost
// - Financed property cost

//   - Percent of repairs for loan amount
//   - Percent of repairs plus purchase price
//   - Percent of ARV (when in other modes)
//   - Change completion status based on focalDeal's mode
//   - Change which sections of property are shown based on focalDeal's mode
//   - Holding costs (clone of ongoing costs)
//   - Add fix and flip outputs
//   - Change displayed outputs based on mode

// - Add Brrrrr
//   - Change controls for refinance loan vs regular loan

// - Implement the account page
//   - This involves changing the other pages
// - Then add a footer

// - Add down payment UI
// - Add loanPurpose UI
// "For"
//   - Property purchase price
//   - Upfront repairs
//   - Purchase price and repairs
// - Implement down payment on loan
// Should I use a radio? Yeah, I guess so.
// * Enter down payment
// * Enter loan amount

// - Allow for upgrades to the state without having to delete
//   all user data
//  - Make stored sectionPacks rawSections be a partial (apart from the main one)
//  - Make sectionPacks be able to have null
//  - Make it so that whenever a stored sectionPack is loaded,
//    missing sections are added but converted to null
//  - When self-loading a sectionPack, don't replace
//    the sections of self that the sectionPack has a null for

// - It would be nice to allow for fields to have placeholders, in which
//   case the styling for their labels would be different

// Eventually: Restrict editing to the *save limit* most recent sections when the
// user has a basicPlan

// Output Section
// - Manage Outputs button—Modal that shows the outputs displayed for each deal mode, and that allows for editing, saving, and loading them
// - Display outputs depending on dealmode
// - Add outputs Component section

// Add more examples
// - Example mgmt
// - Example loan

// Consult branding, logo, and pro wordpress people
// https://bstro.com/

// Get beta users:
// 1. Post it on facebook/insta, asking for testers
// 2. Maybe try posting to facebook groups
// 3. Ask Ed to have a look at it
// 4. Maybe attend an RE meetup or two

// After Beta User attempt
// - Put Upgrade To Pro button back
// - Consult with a marketing agency
// - Make a video
// - Hire a marketing agency
// - Landing page with high SEO
// - Done with the app unless it makes any money

// Demo Link: https://youtu.be/81Ed3e54YS8

// 0. More efficient and better suited to the task than spreadsheets
// 1. Analyze properties faster
// 2. Be as precise as you prefer
// 3. Save and experiment with different combinations of loans and properties
// 4. Allow for custom inputs and outputs (still working on this)

// - Put userName (or first letter of email) on the right side where sign in/sign up were
// - When I change the displayName of a variable, I want that
// of its output to change, right?

// 2.5 Allow custom variables on property, loan, and mgmt (add guts, at least)
// - customVarb entityInfo updateFn updates the local value and gives an inEntity
//   to the varb it targets with source, "customVarb"
// - userVarbs check for entities with source "customVarb" and sums their values
// - customVarb editor is basicVarb editor with loaded displayName
// - is it possible to set editorLength based on title?
// - "Add Variable" button needed on basicInfo

// 3. Bring back custom outputs/output lists
// Analysis output list:
// Now I need a complex version of the menu

// Maybe give lists a "simple" and an "itemized" mode.
// This would require adding an additional value to the list.

// Maybe add an "Add Ongoing Costs" button to Management

// 5. Api variables
// 6. Sharing things with other users
// - Send a sharing invite to another user based on their email
// - If they accept, you can grant them readonly or edit access
//   to whatever they'd like
//   - This would obviously work best if I can get websockets going

// Launch the app.
// - Post it, asking people for input
//   *Reddit
//    - r/realestateinvesting
//    - r/realestate
//    - r/landlords
//    - answer people's questions about how to size up properties
//    - Reddit ads
//   *Podcast ads
//    - Optimal finance daily
//   *Quora
//    - answer people's questions about how to analyze property
//   * Youtube ads
//   * Facebook ads
//    - banner
// - Post on the bigger pockets forum
// - Get an "influencer" to showcase it?

// - Think about the race condition on the front-end for someone starting
//   a subscription. This might not be a problem.
//   - The FE waits one second
//   - The FE sends the request to update its subscription
//   - the subscription is not yet there—there is no subscription
//     that was made recently, or no subscription that has never been
//     obtained by the front end

// - Maybe disable getUserData on the backend unless
//   the email has been verified

// Possible quick tutorials:
// Overview
// Analyze deals
// Reduce data entry
// - Reusing properties for different scenarios
// - Custom variables
// - Custom lists
// - api variables?
// Suit your needs
// - Custom variables
// - Custom outputs
// Compare deals

// Possible roadmap
// - Make roadmap
// - Network effect
//   - Link with other accounts
//   - Share variables, lists, properties, etc
//   - Forum, or a reddit thread or discord
//     This would be too much I think

// One of the easier ways to get started, the way I did, is to buy a duplex with a loan that had a relatively low down payment. An FHA loan could work—that goes as low as 3.5% down. In Saint Paul, you could probably find a decent duplex for $250,000. That would be an $8750 down payment. You'd need to save somewhat more than that, though, to cover some closing costs and meet bank requirements for having extra funds on hand. So you'd need to save maybe like $15,000-$18,000.
