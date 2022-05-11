---
sidebar_position: 4
---

# Request body

**expressly** can parse the body of a request in multiple ways.

## As plain text

```javascript
router.post("/submit", async (req, res) => {
    let body = await req.text();

    res.send(`You posted: "${body}"`)
})
```

## As JSON

```javascript
router.post("/submit", async (req, res) => {
    // Parse body as JSON
    let body = await req.json();

    // Check if the body contains the key "item"
    if ("item" in body) {
        res.send(`item: ${body.item}`)
    } else {
        res.send("You must include item in your body!")
    }
})
```

## As an ArrayBuffer

```javascript
router.post("/submit", async (req, res) => {
    // Parse body into an ArrayBuffer
    let body = await req.arrayBuffer();

    console.debug(body);
})
```