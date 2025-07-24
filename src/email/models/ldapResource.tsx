export function LdapResource() {
  const user = 'johnd';
  const password = 'abc123';
  return `
    Marked - Markdown Parser
    ========================
    
    [Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.
    
    How To Use The Demo
    -------------------
    
    1. Type in stuff on the left.
    2. See the live updates on the right.
    
    usuário: **${user}**
    senha: **${password}**

    That's it.  Pretty simple.  There's also a drop-down option above to switch between various views:
    
    - **Preview:**  A live display of the created HTML as it would render in a browser.
    - **HTML Source:**  The created HTML before your browser makes it pretty.
    
    [Marked]: https://github.com/markedjs/marked/    
  `;
}
