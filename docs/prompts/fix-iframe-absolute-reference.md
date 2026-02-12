In the microsim documentation files @docs/sims/{microsims-name}/index.md we have iframe "templates" that can be copied by the teachers to put into their own webpages.  

In order for the copy icons at the right side to work properly, the iframe templates MUST have the full absolute path to the main.html file on the website.  Here is an example:  
  
  ```html
  <iframe src="https://dmccreary.github.io/computer-science/sims/{microsim-name}/main.html"
          height="450px"
          width="100%"
          scrolling="no"></iframe>
  ```
  
  Please fix the all of the example iframes to all use the absolute path.
  Only make the changes with the html sample code blocks.  Do NOT change
  the working iframe in the index.md This is the second iframe in each of the index.md files for each
  microsim in @docs/sims/{microsims-name}/index.md

  Create a test on one and then show me you understand my request.