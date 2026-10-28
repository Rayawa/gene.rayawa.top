# Interactive Laboratory for Agrobacterium-Mediated Transformation

English | [简体中文](README_zh.md)

### project maintainer@2026. All rights reserved.
An interactive web page developed with HTML5+JS+CSS to illustrate Agrobacterium-mediated plant genetic transformation through a digital demonstration.

---

### 📂 File Structure

The project separates presentation, logic and data in a modular design for maintenance and extension:

* **`index.html`**: the project entry point, defining the simulator's UI structure.
* **`style.css`**: visual styles, layout and experimental animations.
* **`script.js`**: interaction control, experiment-flow management and animation triggers.
* **`favicon.ico`**: the site icon.

---

### 🚀 Usage

This is a frontend-only project that runs in two steps:

1. **Download the source**: place all project files in one folder. Downloading and extracting a ZIP archive is recommended.
2. **Run locally**: find **`index.html`** in the folder and open it in a browser (Chrome, Edge or Safari is recommended) to start the interactive experiment.

---

### 💡 Development Notes

* **Internationalization**: edit the fields in `content.json` to switch languages without changing the HTML tags in `index.html`.
* **Interaction logic**: the experiment follows the biological sequence of Agrobacterium transformation, including Ti plasmid construction, infection and T-DNA integration; `script.js` enforces the step logic.
* **Lightweight implementation**: no heavyweight third-party framework is required. The page loads quickly and is intended as a teaching aid.
