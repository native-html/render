import React from 'react';
import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from 'typedoc';
import {
  TokenPunctuation,
  TokenAttrName,
  TokenKeyword,
  TokenPlain,
  TokenLiteral
} from './tokens';
import renderArrowSignature from './renderArrowSignature';
import renderFunctionSignature from './renderFunctionSignature';
import Indent from './Indent';
import renderType from './renderType';
import renderTypeParameters from './renderTypeParameters';
import reduceReflectionsWith from './reduceReflectionsWith';
import Params from './Params';

function renderArrowSignatures(
  signatures: JSONOutput.SignatureReflection[],
  params: Params
) {
  if (!signatures) {
    return 'unknown';
  }
  return <>{signatures.map((s) => renderArrowSignature(s, params))}</>;
}

function renderFunctionSignatures(
  signatures: JSONOutput.SignatureReflection[],
  params: Params
) {
  return <>{signatures.map((s) => renderFunctionSignature(s, params))}</>;
}

function renderConst(name: string) {
  return (
    <>
      <TokenKeyword>const</TokenKeyword>
      <code> </code>
      <TokenPlain>{name}</TokenPlain>
      <TokenPunctuation>:</TokenPunctuation>
      <code> </code>
    </>
  );
}

function renderAttribute(
  name: string,
  typeElm: any,
  flags: JSONOutput.ReflectionFlags,
  params: Params
) {
  const nameToken = <TokenAttrName>{name}</TokenAttrName>;
  return (
    <>
      <Indent indent={params.indent} />
      {flags.isStatic && <TokenKeyword>static </TokenKeyword>}
      {params.resolveMembersLinks ? (
        <a href={`#${name.toLowerCase()}`}>{nameToken}</a>
      ) : (
        nameToken
      )}
      {flags.isOptional && <TokenPunctuation>?</TokenPunctuation>}
      <TokenPunctuation>{': '}</TokenPunctuation>
      {typeElm}
      <TokenPunctuation>{';'}</TokenPunctuation>
      <br />
    </>
  );
}

function renderEnumMember(name: string, typeElm: any, params: Params) {
  const nameToken = <TokenAttrName>{name}</TokenAttrName>;
  return (
    <>
      <Indent indent={params.indent} />
      {params.resolveMembersLinks ? (
        <a href={`#${name.toLowerCase()}`}>{nameToken}</a>
      ) : (
        nameToken
      )}
      <TokenPunctuation>{' = '}</TokenPunctuation>
      {typeElm}
      <TokenPunctuation>{';'}</TokenPunctuation>
      <br />
    </>
  );
}

function renderPropsAndMethods(
  reflection: JSONOutput.DeclarationReflection,
  params: Params
) {
  const props = reflection.children?.filter(
    (c) => c.kind === ReflectionKind.Property || getKindString(c) === 'Property'
  );
  const methods = reflection.children?.filter(
    (c) => c.kind === ReflectionKind.Method || getKindString(c) === 'Method'
  );
  return (
    <>
      {props?.reduce(
        reduceReflectionsWith(null, params, renderReflection),
        null
      )}
      {methods?.reduce(
        reduceReflectionsWith(null, params, renderReflection),
        null
      )}
    </>
  );
}

function renderFunction(
  reflection: JSONOutput.DeclarationReflection,
  params: Params
) {
  return (
    <>
      <TokenKeyword>function</TokenKeyword>
      <code> </code>
      <TokenPlain>{reflection.name}</TokenPlain>
      {renderFunctionSignatures(reflection.signatures, params)}
    </>
  );
}

function getKindString(
  reflection: JSONOutput.DeclarationReflection
): string | undefined {
  if ('kindString' in reflection) {
    const obj = reflection as unknown as { kindString?: string };
    return obj.kindString;
  }
  return undefined;
}

function getDefaultValue(
  reflection: JSONOutput.DeclarationReflection
): unknown {
  if ('defaultValue' in reflection) {
    const obj = reflection as unknown as { defaultValue?: unknown };
    return obj.defaultValue;
  }
  return undefined;
}

function getTypeParameter(
  reflection: JSONOutput.DeclarationReflection
): JSONOutput.TypeParameterReflection[] | undefined {
  if ('typeParameter' in reflection) {
    const obj = reflection as unknown as {
      typeParameter?: JSONOutput.TypeParameterReflection[];
    };
    return obj.typeParameter;
  }
  return undefined;
}

// Helper function to get ReflectionKind from reflection, with fallback to kindString
function getReflectionKind(
  reflection: JSONOutput.DeclarationReflection
): ReflectionKind | null {
  // Use kind if available (preferred)
  if (reflection.kind !== undefined) {
    return reflection.kind;
  }

  // Fallback: map kindString to ReflectionKind (for TypeDoc 0.28 compatibility)
  const kindStringMap: Record<string, ReflectionKind> = {
    Function: ReflectionKind.Function,
    'Type alias': ReflectionKind.TypeAlias,
    Enum: ReflectionKind.Enum,
    Class: ReflectionKind.Class,
    Interface: ReflectionKind.Interface,
    Parameter: ReflectionKind.Parameter,
    Property: ReflectionKind.Property,
    'Type literal': ReflectionKind.TypeLiteral,
    Method: ReflectionKind.Method,
    Variable: ReflectionKind.Variable,
    'Enum member': ReflectionKind.EnumMember,
    'Call signature': ReflectionKind.CallSignature
  };

  const kindString = getKindString(reflection);
  if (kindString) {
    return kindStringMap[kindString] || null;
  }

  // Infer from reflection properties (for TypeDoc 0.28 compatibility)
  if (reflection.signatures) {
    return ReflectionKind.Function;
  }
  if (getDefaultValue(reflection) !== undefined) {
    return ReflectionKind.EnumMember;
  }
  if (reflection.type) {
    return ReflectionKind.Property;
  }
  return ReflectionKind.TypeAlias;
}

export default function renderReflection(
  reflection: JSONOutput.DeclarationReflection,
  params: Params
) {
  if (!reflection) {
    console.warn('renderReflection called with undefined reflection');
    return <TokenKeyword>any</TokenKeyword>;
  }
  let nextParams: Params = params;
  const kind = getReflectionKind(reflection);

  switch (kind) {
    case ReflectionKind.Function:
      return renderFunction(
        reflection,
        params.withMemberLinks().withTypeParamsLinks()
      );
    case ReflectionKind.TypeAlias:
      return (
        <>
          <TokenKeyword>type</TokenKeyword>
          <code> </code>
          <TokenPlain>{reflection.name}</TokenPlain>
          {renderTypeParameters(
            getTypeParameter(reflection) || reflection.typeParameters || [],
            params.withTypeParamsLinks()
          )}
          <TokenPunctuation>{' = '}</TokenPunctuation>
          {reflection.type ? (
            renderType(reflection.type, params)
          ) : (
            <TokenKeyword>any</TokenKeyword>
          )}
        </>
      );
    case ReflectionKind.Enum:
      return (
        <>
          <TokenKeyword>enum</TokenKeyword>
          <code> </code>
          <TokenPlain>{reflection.name}</TokenPlain>
          <code> </code>
          <TokenPunctuation>{'{'}</TokenPunctuation>
          <br />
          {reflection.children.reduce(
            reduceReflectionsWith(null, params.withIndent(), renderReflection),
            null
          )}
          <TokenPunctuation>{'}'}</TokenPunctuation>
        </>
      );
    case ReflectionKind.Class:
      return (
        <>
          <TokenKeyword>class</TokenKeyword>
          <code> </code>
          <TokenPlain>{reflection.name}</TokenPlain>
          {renderTypeParameters(
            getTypeParameter(reflection) || reflection.typeParameters || [],
            params.withTypeParamsLinks()
          )}
          <code> </code>
          <TokenPunctuation>{'{'}</TokenPunctuation>
          <br />
          {renderPropsAndMethods(
            reflection,
            params.withMemberLinks().withIndent()
          )}
          <TokenPunctuation>{'}'}</TokenPunctuation>
        </>
      );
    case ReflectionKind.Interface:
      nextParams = params.withIndent().withMemberLinks();
      return (
        <>
          <TokenKeyword>interface</TokenKeyword>
          <code> </code>
          <TokenPlain>{reflection.name}</TokenPlain>
          {renderTypeParameters(
            getTypeParameter(reflection) || reflection.typeParameters || [],
            params.withTypeParamsLinks()
          )}
          <code> </code>
          <TokenPunctuation>{'{'}</TokenPunctuation>
          <br />
          {reflection.signatures && (
            <>
              <Indent indent={nextParams.indent} />
              {renderFunctionSignatures(reflection.signatures, nextParams)}
              <TokenPunctuation>;</TokenPunctuation>
              <br />
            </>
          )}
          {renderPropsAndMethods(reflection, nextParams.withMemberLinks())}
          <TokenPunctuation>{'}'}</TokenPunctuation>
        </>
      );
    case ReflectionKind.Parameter:
      return renderAttribute(
        reflection.name,
        reflection.type ? (
          renderType(reflection.type, params)
        ) : (
          <TokenKeyword>any</TokenKeyword>
        ),
        reflection.flags,
        params
      );
    case ReflectionKind.Property:
      nextParams = params.withoutMemberLinks();
      return renderAttribute(
        reflection.name,
        reflection.type ? (
          renderType(reflection.type, nextParams)
        ) : (
          <TokenKeyword>any</TokenKeyword>
        ),
        reflection.flags,
        params
      );
    case ReflectionKind.TypeLiteral:
      if (!reflection.groups && !reflection.signatures) {
        console.warn('Unhandled Type Literal with no group', reflection);
        return <TokenKeyword>any</TokenKeyword>;
      }
      if (reflection.signatures) {
        return renderArrowSignatures(reflection.signatures, params);
      }
      let ret: React.ReactElement | null = null;
      for (const group of reflection.groups!) {
        if (group.title === 'Properties') {
          const props = reflection.children.filter((c) =>
            group.children.includes(c.id)
          );
          ret = (
            <>
              <TokenPunctuation>{'{'}</TokenPunctuation>
              <br />
              {props.map((p) => renderReflection(p, params.withIndent()))}
              <Indent indent={params.indent} />
              <TokenPunctuation>{'}'}</TokenPunctuation>
            </>
          );
        } else {
          throw new Error(`Unhandled group of type ${group.title}`);
        }
      }
      return ret;
    case ReflectionKind.Method:
      return reflection.signatures?.map((s) => {
        return renderAttribute(
          reflection.name,
          renderArrowSignatures([s], params.withoutMemberLinks()),
          reflection.flags,
          params
        );
      });
    case ReflectionKind.CallSignature:
      // CallSignature is typically a SignatureReflection, not DeclarationReflection
      // If reflection has signatures, use the first one
      if (reflection.signatures && reflection.signatures.length > 0) {
        return (
          <>
            {renderConst(reflection.name)}
            {renderArrowSignature(reflection.signatures[0], params)}
          </>
        );
      }
      // Fallback: check if reflection has SignatureReflection properties
      if (
        'type' in reflection &&
        (reflection as unknown as JSONOutput.SignatureReflection).type
      ) {
        return (
          <>
            {renderConst(reflection.name)}
            {renderArrowSignature(
              reflection as unknown as JSONOutput.SignatureReflection,
              params
            )}
          </>
        );
      }
      // If no valid signature found, return fallback
      return (
        <>
          {renderConst(reflection.name)}
          <TokenKeyword>any</TokenKeyword>
        </>
      );
    case ReflectionKind.Variable:
      if (reflection.signatures) {
        // For docs legibility, consider const with signature like functions
        return renderFunction(reflection, params.withMemberLinks());
      }
      return (
        <>
          {renderConst(reflection.name)}
          {reflection.type ? (
            renderType(reflection.type, params)
          ) : (
            <TokenKeyword>any</TokenKeyword>
          )}
        </>
      );
    case ReflectionKind.EnumMember:
      return renderEnumMember(
        reflection.name,
        <TokenLiteral>{reflection.defaultValue}</TokenLiteral>,
        params
      );
    default:
      console.warn('Unhandled Declaration Reflection, falling back to any', {
        kind: kind,
        kindString: getKindString(reflection),
        reflection
      });
      // Try to render as a property if it has a type
      if (reflection.type) {
        return renderAttribute(
          reflection.name || '',
          renderType(reflection.type, params),
          reflection.flags || {},
          params
        );
      }
      return <TokenKeyword>any</TokenKeyword>;
  }
}
