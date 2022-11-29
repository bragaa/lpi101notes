val css: InternalStyleSheet = Github()
//Set the wrap style
css.addRule("pre code", "white-space: pre-wrap;")
markdownView.addStyleSheet( css)
markdownView.loadMarkdown(content)
