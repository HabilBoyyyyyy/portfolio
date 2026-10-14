import os
import uvicorn
import gradio as gr
from main import app

try:
    import spaces
    @spaces.GPU
    def _gpu_worker():
        return True
except Exception:
    pass

with gr.Blocks(title="Habil Portfolio API") as demo:
    gr.Markdown("# 🚀 Habil Portfolio API")
    gr.Markdown("The backend for Habil's Portfolio is online and running.")
    gr.Markdown("Explore endpoints: [API Profile](/api/profile) · [API Skills](/api/skills) · [API Projects](/api/projects) · [Swagger Docs](/docs)")

app = gr.mount_gradio_app(app, demo, path="/")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=7860, reload=False)
