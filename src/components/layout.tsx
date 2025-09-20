import React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Separator } from './ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from './ui/breadcrumb';
import { ConfigProvider, theme } from 'antd';

type MainLayoutWrapperProps = {
  children: React.ReactNode;
  sideBarContent: React.ReactNode;
  pageTitle: string;
};

export const MainLayoutWrapper = React.memo<MainLayoutWrapperProps>(
  ({ children, sideBarContent, pageTitle }) => {
    return (
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#ffffff',
            colorBgBase: '#000000',
            colorTextBase: '#ffffff',
          },
        }}
      >
        <div className="min-h-screen bg-black">
          <SidebarProvider>
            <AppSidebar sideBarContent={sideBarContent} />
            <SidebarInset>
              <header className="flex h-14 shrink-0 items-center gap-2 bg-black border-b border-zinc-800">
                <div className="flex flex-1 items-center gap-2 px-3">
                  <SidebarTrigger className="text-gray-100 hover:text-black" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4 bg-gray-100"
                  />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbPage className="line-clamp-1 text-gray-100">
                          {pageTitle}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>
              <div className="flex flex-1 flex-col gap-4 px-4 py-10 bg-black">
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </ConfigProvider>
    );
  }
);