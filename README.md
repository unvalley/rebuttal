## Motivation

TBD

## Development Guide

- fill in the `.env`
  - `DATABASE_URL` to access the data store hosted in PlanetScale.
  - `NEXTAUTH_SECRET` to work the next-auth.

### Why no MicrotaskAllocation?

If workers are allocated and quit the user experiment, the MicrotaskAllocation record is not executed and will remain.
If many workers do so, we will not have completed MicrotaskResult.
So, I have thought that workers should care only about the MicrotaskResult count.
