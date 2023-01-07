#### User
- id
- fullName
- password*
- email*
- phone
- userRole*

#### Company
- name
- rate ({topWear: 12, bottomWear: 10, woolen: 20})
- owner_id (FK from users collection)

#### LaundaryRequest
- pickupDate
- items ({topWear: 3, woolen: 2})
- totalCost: 76
- status (requested, accepted, rejected, inProcess, delivered)
- companyId
- address

