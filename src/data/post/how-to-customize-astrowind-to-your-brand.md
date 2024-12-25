---
publishDate: 2022-09-12T00:00:00Z
title: How to setup git to use a different git commit identity based on the repo's directory
excerpt: Automatically update your git config based on what folder the repo is in, so you can have a dedicated folder for your work repos and maks sure your git commits always use the correct git identity.
image: https://images.unsplash.com/photo-1546984575-757f4f7c13cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80
tags:
  - development
  - automation
  - how-to
  - git
  - cli
metadata:
  canonical: https://evanharmon.com/how-to-setup-git-to-use-a-different-git-commit-identity-based-on-the-repos-directory
---
I use my personal Mac as my work computer so it was a chore to change my git config whenever switching between personal and work coding projects. And if I forgot, my personal git commit identity would be committed to my work repos. However, there is a way to automatically update your git config based on what folder the repo is in, so you can have a dedicated folder for your work repos, and your git commits for work will never use your personal git commit identity or vice versa.
## Setup
In your global `.gitconfig` file (normally in the `~/` directory on Mac and Linux), add a section like this:

```bash
[includeIf "gitdir:~/Local/exampleWorkFolder/"]
 path = ~/Local/exampleWorkFolder/.gitconfig
```

The trailing slash makes it apply to all subfolders as well.

In the folder where you want a specific git config to apply, add a separate `.gitconfig` file with those settings in it. For the example above, you would add a `.gitconfig` file to `~/Local/exampleWorkFolder/.gitconfig` and add git configuration settings that should only apply if working in that directory. E.g:

```bash
[user]
 name = Evan Harmon
 email = evan@work-email.com
```

With this setup, whenever you work from any repo inside `~/Local/exampleWorkFolder/`, your git identity would be Evan Harmon - <evan@work-email.com>. But when working from any repo in any other folder, your git identity would be whatever you set it to in ~/.gitconfig. E.g, <evan@personal-email.com>.
