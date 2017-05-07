# myalias.tech server

## Endpoints

### GET /alias/:id?service=social_network
  Search the similar aliases for ":id" with it's value at the "service"
  
  :id   aliasName that is going to be search
  
Response: 

```javascript
[
  {
    "alias": "thisIsAnAlias",
    "username": "thisIsAUsernameForTheSocialNetwork"
  },
  {
    "alias": "thisIsAnAlias",
    "username": "thisIsAUsernameForTheSocialNetwork"
  }
]
```
