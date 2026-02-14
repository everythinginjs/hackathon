import type { Meta, StoryObj } from '@storybook/react';
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Title,
  Subtitle,
  Caption,
  Lead,
  Large,
  Small,
  Muted,
  P,
  Blockquote,
  InlineCode,
} from './typography';

const meta: Meta = {
  title: 'UI/Typography',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const AllTypography = () => (
  <div className="space-y-8">
    <div>
      <H1>H1 - The quick brown fox jumps over the lazy dog</H1>
    </div>
    <div>
      <H2>H2 - The quick brown fox jumps over the lazy dog</H2>
    </div>
    <div>
      <H3>H3 - The quick brown fox jumps over the lazy dog</H3>
    </div>
    <div>
      <H4>H4 - The quick brown fox jumps over the lazy dog</H4>
    </div>
    <div>
      <H5>H5 - The quick brown fox jumps over the lazy dog</H5>
    </div>
    <div>
      <H6>H6 - The quick brown fox jumps over the lazy dog</H6>
    </div>
    <div>
      <Title>Title - The quick brown fox jumps over the lazy dog</Title>
    </div>
    <div>
      <Subtitle>Subtitle - The quick brown fox jumps over the lazy dog</Subtitle>
    </div>
    <div>
      <Caption>Caption - The quick brown fox jumps over the lazy dog</Caption>
    </div>
    <div>
      <Lead>
        Lead - A modal dialog that interrupts the user with important content
        and expects a response.
      </Lead>
    </div>
    <div>
      <Large>Large - The quick brown fox jumps over the lazy dog</Large>
    </div>
    <div>
      <Small>Small - The quick brown fox jumps over the lazy dog</Small>
    </div>
    <div>
      <Muted>Muted - The quick brown fox jumps over the lazy dog</Muted>
    </div>
    <div>
      <P>
        P - The king, seeing how much happier his subjects were, realized the
        error of his ways and repealed the joke tax.
      </P>
    </div>
    <div>
      <Blockquote>
        "After all," he said, "everyone enjoys a good joke, so it's only fair
        that they should pay for the privilege."
      </Blockquote>
    </div>
    <div>
      <P>
        Install dependencies with <InlineCode>npm install</InlineCode> and run
        the dev server.
      </P>
    </div>
  </div>
);

export const Headings: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <H5>Heading 5</H5>
      <H6>Heading 6</H6>
    </div>
  ),
};

export const TextVariants: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <Title>Title Text</Title>
      <Subtitle>Subtitle Text</Subtitle>
      <Caption>Caption Text</Caption>
      <Lead>Lead paragraph for important content</Lead>
      <Large>Large text for emphasis</Large>
      <Small>Small text for fine print</Small>
      <Muted>Muted text for secondary content</Muted>
    </div>
  ),
};

export const Paragraph: StoryObj = {
  render: () => (
    <div className="max-w-prose">
      <P>
        The king, seeing how much happier his subjects were, realized the error
        of his ways and repealed the joke tax.
      </P>
      <P>
        Once upon a time, in a far-off land, there was a very lazy king who
        spent all day lounging on his throne. One day, his advisors came to him
        with a problem: the kingdom was running out of money.
      </P>
    </div>
  ),
};

export const Quote: StoryObj = {
  render: () => (
    <div className="max-w-prose">
      <Blockquote>
        "After all," he said, "everyone enjoys a good joke, so it's only fair
        that they should pay for the privilege."
      </Blockquote>
    </div>
  ),
};

export const Code: StoryObj = {
  render: () => (
    <P>
      Install dependencies with <InlineCode>npm install</InlineCode> and run
      the dev server with <InlineCode>npm run dev</InlineCode>.
    </P>
  ),
};

export const ContentExample: StoryObj = {
  render: () => (
    <div className="max-w-prose">
      <H2>Introduction</H2>
      <P>
        The king, seeing how much happier his subjects were, realized the error
        of his ways and repealed the joke tax.
      </P>
      <H3>The Story Begins</H3>
      <P>
        Once upon a time, in a far-off land, there was a very lazy king who
        spent all day lounging on his throne. One day, his advisors came to him
        with a problem: the kingdom was running out of money.
      </P>
      <Blockquote>
        "After all," he said, "everyone enjoys a good joke, so it's only fair
        that they should pay for the privilege."
      </Blockquote>
      <H4>Installation</H4>
      <P>
        To get started, run <InlineCode>npm install</InlineCode> in your
        terminal.
      </P>
    </div>
  ),
};
