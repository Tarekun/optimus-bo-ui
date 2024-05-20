# OptimusUI

This repository contains the code base for the `optimus-bo-ui` library. It's a Typescript React library based on popular React libraries such as MaterialUI, React Query. The idea for library stemmed for the realisation that across many different apps I tend to implement components that are very similar and based on the same libraries. So in order to avoid having to rewrite them every time, I started collecting them and abstracting the differences in supported props for the components and so OptimusUI was born. Not only that but having to rewrite the same boilerplate code to configure the initial React app was getting tedious and because of that I implemented the first draft of the `OptimusUiApp` component that support multiple objects as props to configure common libraries and also supporting new functionalities such as language packs, user authentication, dynamic page title updates, and providing default layout options to choose from

The library is still in its infancy, under development and breaking changes are to be expected. A proper documentation hasn't been written yet, but work was planned for this. Comments, suggestions or even contributions are all welcomed, even though I haven't set up any workflow for it yet.

# Installation

Simply navigate to your React project's root directory and run:

```
npm install optimus-bo-ui
```
