# ScrimList

ScrimList automatically numbers a sequence of topics for any course in Scrimba.
This helps learners quickly identify the number and sequence of topics for a course.
There is no need to manually count or guess the number of topics when learning on Scrimba.
As a learner on Scrimba, I have **_independently_** developed this extension .
This extension is **not officially endorsed** or affiliated with Scrimba.

- [x] Ensure outer numbering works when activated for most courses, tutorials and paths and for all siblings[^1].
  - [x] Numbering should appear for simple courses with a list of scrims like the "Learn Python" course.
  - [x] Numbering should work for paths (Fullstack path) or advanced tutorials (TypeScript) with nested content.
  - [x] Ensure all topics are numbered including "Certificate of Completion" and the like.
- [x] Enable or disable the extension for convenience, ignore opened tabs - set badge in icon[^1].
  - [x] Note: User needs to reload existing pages or tabs that have already been opened to reflect modified state.
- [x] Advanced Numbering options for nested topics - Numbering subtopics[^2].
  - [x] Numbering must appear for subtopics, list of topics with first or all scrim items
- [x] Copy and Paste list of topics to clipboard - List of Top Level Topics and Nested Topics[^3].
  - [x] Allow for copying titles list to clipboard on clicking the logo icon injected into the page.
  - [x] The logo is injected for the very first topic and the top level topics are copied to clipboard on click.
  - [x] The logo icon is available for each nested topic and corresponding topics list is copied to clipboard on click.
- [ ] Advanced Dynamic functionality - ensure numbering loads when the user visits a page via multiple clicks.
  - [ ]  Internal routing within the page must result in correct result based on current state.
  - [ ]  Check if possible to dynamically reload the current page when switched ON or OFF.
  - [ ]  Refactor, add customization options for numbering, other features while ensuring correctness.
     
[^1]: Released in [v0.1.0.0](https://github.com/abdullah85/scrimList/releases/tag/v0.1.0.0)
[^2]: Released in [v0.2.0.0](https://github.com/abdullah85/scrimList/releases/tag/v0.2.0.0)
[^3]: Released in [v1.0.0.0](https://github.com/abdullah85/scrimList/releases/tag/v1.0.0.0)
