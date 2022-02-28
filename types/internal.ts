/// <reference path="ink.ts" />

import type { Compartment as VendorCompartment, Extension as VendorExtension, StateEffect as VendorStateEffect } from '@codemirror/state'
import type { SvelteComponent as VendorComponent } from 'svelte'
import type Ink from '/types/ink'
import type InkUi from '/types/ui'

export namespace InkInternal {
  export interface Configuration {
    extensions: InkInternal.OptionExtension<Ink.Values.Extensions>[]
    options: Ink.Options
    root: InkUi.Root
  }

  export interface Extension {
    compartment: InkInternal.Vendor.Compartment
    resolver: InkInternal.Vendor.ExtensionResolver
  }

  export type Extensions = {
    [ExtensionName in Ink.Options.ExtensionNames]: InkInternal.Extension
  }

  export interface OptionExtension<OptionName extends Ink.Values.Extensions> extends InkInternal.Extension {
    effect?: InkInternal.Vendor.StateEffect<any>
    name: OptionName
  }

  export namespace Vendor {
    // All vendor types (and adapters) should be encapsulated here.
    export type Compartment = VendorCompartment
    export type Component = VendorComponent
    export type Extension = VendorExtension
    export type ExtensionResolver = (options: Ink.Options) => InkInternal.Vendor.Extension
    export type ExtensionResolvers = {
      [ExtensionName in Ink.Options.ExtensionNames]: ExtensionResolver
    }
    export type StateEffect<Type> = VendorStateEffect<Type>
  }
}

export default InkInternal
