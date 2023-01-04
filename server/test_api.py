from server_python import app


def test_submit():
    client = app.test_client()
    request = client.post("/api/submit", data={"title": "test title", "content": "test content"})
    assert request.status_code == 200
