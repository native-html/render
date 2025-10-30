import React from 'react';
import type { JSONOutput } from 'typedoc';
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
  const props = reflection.children?.filter((c) => c.kindString === 'Property');
  const methods = reflection.children?.filter((c) => c.kindString === 'Method');
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

export default function renderReflection(
  reflection: JSONOutput.DeclarationReflection,
  params: Params
) {
  let nextParams: Params = params;
  const inferredKindString =
    reflection.kindString ||
    (reflection.signatures
      ? 'Function'
      : typeof (reflection as any).defaultValue !== 'undefined'
        ? 'Enum member'
        : (reflection as any).type
          ? 'Property'
          : undefined);
  switch (inferredKindString) {
    case 'Function':
      return renderFunction(
        reflection,
        params.withMemberLinks().withTypeParamsLinks()
      );
    case 'Type alias':
      return (
        <>
          <TokenKeyword>type</TokenKeyword>
          <code> </code>
          <TokenPlain>{reflection.name}</TokenPlain>
          {renderTypeParameters(
            reflection.typeParameter,
            params.withTypeParamsLinks()
          )}
          <TokenPunctuation>{' = '}</TokenPunctuation>
          {renderType(reflection.type, params)}
        </>
      );
    case 'Enum':
      return (
        <>
          <TokenKeyword>enum</TokenKeyword>
          <code> </code>
          <TokenPlain>{reflection.name}</TokenPlain>
          <code> </code>
          <TokenPunctuation>{'{'}</TokenPunctuation>
          <br />
          {reflection.children?.reduce(
            reduceReflectionsWith(null, params.withIndent(), renderReflection),
            null
          )}
          <TokenPunctuation>{'}'}</TokenPunctuation>
        </>
      );
    case 'Class':
      return (
        <>
          <TokenKeyword>class</TokenKeyword>
          <code> </code>
          <TokenPlain>{reflection.name}</TokenPlain>
          {renderTypeParameters(
            reflection.typeParameter,
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
    case 'Interface':
      nextParams = params.withIndent().withMemberLinks();
      return (
        <>
          <TokenKeyword>interface</TokenKeyword>
          <code> </code>
          <TokenPlain>{reflection.name}</TokenPlain>
          {renderTypeParameters(
            reflection.typeParameter,
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
    case 'Parameter':
      return renderAttribute(
        reflection.name,
        renderType(reflection.type, params),
        reflection.flags,
        params
      );
    case 'Property':
      nextParams = params.withoutMemberLinks();
      return renderAttribute(
        reflection.name,
        renderType(reflection.type, nextParams),
        reflection.flags,
        params
      );
    case 'Type literal':
      if (!reflection.groups && !reflection.signatures) {
        console.warn('Unhandled Type Literal with no group', reflection);
        return <TokenKeyword>any</TokenKeyword>;
      }
      if (reflection.signatures) {
        return renderArrowSignatures(reflection.signatures, params);
      }
      let ret: any = null;
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
    case 'Method':
      return reflection.signatures?.map((s) => {
        return renderAttribute(
          reflection.name,
          renderArrowSignatures([s], params.withoutMemberLinks()),
          reflection.flags,
          params
        );
      });
    case 'Call signature':
      return (
        <>
          {renderConst(reflection.name)}
          {renderArrowSignature(reflection, params)}
        </>
      );
    case 'Variable':
      if (reflection.signatures) {
        // For docs legibility, consider const with signature like functions
        return renderFunction(reflection, params.withMemberLinks());
      }
      return (
        <>
          {renderConst(reflection.name)}
          {renderType(reflection.type, params)}
        </>
      );
    case 'Enum member':
      return renderEnumMember(
        reflection.name,
        <TokenLiteral>{reflection.defaultValue}</TokenLiteral>,
        params
      );
    default:
      console.warn(
        'Unhandled Declaration Reflection, falling back to any',
        reflection
      );
      return <TokenKeyword>any</TokenKeyword>;
  }
}
