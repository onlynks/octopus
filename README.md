# octopus
Custom element permettant de proposer plusieurs actions lors d'un clic sur un bouton.

**exemple d'implémentation:**

```html
<body>

  <button class="custom-btn btn" is="octopus-ce" id="my-button">Let's begin</button>
  
  <script type="module">
        import Octopus from "./js/octopus.js";
   </script>
   <script>
        const myButton = document.getElementById("my-button");
        const buttons = [
            {
                label: "Naviguer",
                action: "navigate"
            },
            {
                label: "Ouvrir dans un nouvel onglet",
                action: "openTab"
            },
            {
                label: "Print",
                action: "openTab"
            },
            {
                label: "Retourner sur Google",
                action: "google"
            },
            {
                label: "Print",
                action: "openTab"
            }
        ];

        function navigate(element) {
            window.location.href = element.getAttribute("href");
        }

        function openTab(element) {
            console.log(element)
        }

        function google() {
            window.location.href = "https://www.google.com/";
        }

        myButton.setAttribute("buttons", JSON.stringify(buttons));
    </script>

</body>
```
