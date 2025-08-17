import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { IconBrandGithub } from "@tabler/icons-react"

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        Shapeless
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [
    {
      label: "Documentations",
      url: "/docs",
      text: "Documentations",
      active: "url",
      secondary: false,
      description: "Link to documentations"
    },
    {
      label: "Templates",
      url: "#",
      text: "Templates",
      active: "url",
      secondary: false,
      description: "Link to documentations"
    },
    {
      label: "GITHUB",
      icon: <IconBrandGithub />,
      url: 'https://github.com/phe-rus/shapeless',
      text: "GITHUB",
      active: "url",
      secondary: true,
      description: "Link to git repo"
    }
  ],
  githubUrl: "https://github.com/phe-rus/shapeless"
}
