The {{x-foo}} in You
====================

Declarative, evented, data-bound components will change the way you
build abstractions in browser applications. The best part is, you're
already an expert, you just might not know it yet.

We'll discuss how to:

- use a component
- know when not to use a component
- communicate with the world outside the component
- refactor large components
- test components in isolation
- make components accessible

## What's a component?

A custom element with

- a template
- an isolated Ember.View controlling it
- an element restricted, isolate scoped, transcluded directive
  (the best kind, ofc)

## When not to use it

```handlebars
{{#each assignment in assignments}}
  {{x-assignment assignment=assignment assignments=assignments}}
{{/each}}

{{#each assignment in assignments}}
  {{partial "assignment"}}
  {{render "assignment" assignment}}
{{/each}}
```

## Communication

- data binding
- actions

## Refactor Large Components

- create composites
- create mixins

## Random

- Think about native interactive elements when you're
  designing a component's api
- Templates should
  - be rare
  - bring composite components together for convenience
  - in polymer it is your only abstraction, so you need
    to have complicated templates, but ember has views
    coupled with routes so components have a smaller
    scope.


