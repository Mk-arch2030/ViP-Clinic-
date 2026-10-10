/// <reference types="vite/client" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Stage6IntegrationApp } from './Stage6IntegrationApp';
const root = document.getElementById('stage6-root');
if (!root) throw new Error('Integration root missing');
createRoot(root).render(<React.StrictMode><Stage6IntegrationApp /></React.StrictMode>);
