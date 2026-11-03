import {about} from './about'
import {category} from './category'
import {home} from './home'
import {imageWithAlt} from './objects'
import {pages} from './pages'
import {post} from './post'
import {service} from './service'
import {settings} from './settings'
import {testimonial} from './testimonial'
import {workshop} from './workshop'

export const schemaTypes = [home, about, pages, settings, service, workshop, testimonial, post, category, imageWithAlt]

// One fixed document each; the desk shows them as single items, not lists
export const SINGLETONS = ['home', 'about', 'pages', 'settings']
