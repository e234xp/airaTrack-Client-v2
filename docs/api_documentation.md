
---
# Get Album List
> This function for getting album list.

**URL:** `${apiBaseUrl}/airaTracker/album`

**Method:** `GET`

**Header:**
  - `sessionId` (String)

**Returns:**
  - `data` (ObjectArray): api result.
    - `albumId`
    - `albumName`
    - `description`

---
# Edit Album
> This function for editing album.

**URL:** `${apiBaseUrl}/airaTracker/album`

**Method:** `PUT`

**Header:**
  - `sessionId` (String)

**Data:**
  - `albumId` (String): Album ID.
  - `albumName` (String): Album Name.
  - `description` (String): Description.

**Returns:**
  - `result` (Object): api result.

---
# Upload Photo to Album
> This function for uploading a photo into album.

**URL:** `${apiBaseUrl}/airaTracker/albums/uploadPhoto`

**Method:** `POST`

**Header:**
  - `sessionId` (String)

**Data:**
  - `face_image` (String): Image Base64.
  - `albumId` (String): Album ID.

**Returns:**
  - `result` (Object): api result.