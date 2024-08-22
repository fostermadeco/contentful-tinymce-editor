import React, { useCallback, useState, useEffect, ChangeEvent } from 'react';
import { ConfigAppSDK } from '@contentful/app-sdk';
import { Heading, Form, Paragraph, Flex, FormControl, TextInput } from '@contentful/f36-components';
import { css } from 'emotion';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import {
  defaultParameters,
  AppInstallationParameters,
} from "./ConfigDefaults";



type ParameterKeys = keyof AppInstallationParameters;


const ConfigScreen = () => {
  const sdk = useSDK<ConfigAppSDK>();
  const [parameters, setParameters] = useState<AppInstallationParameters>({
    ...defaultParameters,
    ...sdk.parameters.installation
  });
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  const onInputChange = (event: ChangeEvent): void => {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
    const newParams: any = { ...parameters };
    newParams[name as ParameterKeys] = value;

    setParameters(newParams);
  };

  return (
    <Flex flexDirection="column" className={css({ margin: '80px', maxWidth: '800px' })}>
      <Form>
        <Heading>App Config</Heading>
        <Paragraph>Config for TinyMCE field App.</Paragraph>
        <FormControl>
          <FormControl.Label>TinyMCE API Key</FormControl.Label>
          <TextInput
            id="tinyMceApiKey"
            type="text"
            name="tinyMceApiKey"
            placeholder=""
            value={parameters?.tinyMceApiKey}
            width={100}
            onChange={(e) => {
              setParameters({
                ...parameters,
                tinyMceApiKey: e.target.value,
              })
            }}
          />
          <FormControl.Label>Plugins</FormControl.Label>
          <TextInput
            name="plugins"
            id="plugins"
            isRequired
            value={parameters?.plugins}
            onChange={onInputChange}
          // textLinkProps={{
          //   icon: "ExternalLink",
          //   text: "Plugins",
          //   onClick: () =>
          //     window.open("https://www.tiny.cloud/docs/plugins/"),
          // }}
          />

          <FormControl.Label>Toolbar</FormControl.Label>
          <TextInput
            name="toolbar"
            id="toolbar"
            isRequired
            value={parameters.toolbar}
            onChange={onInputChange}
          />
          <FormControl.HelpText>
            Use '|' as a toolbar divider. There are 4 toolbar groups: 'formatgroup', 'assetgroup', 'insertgroup' and 'extragroup'.
          </FormControl.HelpText>

          <FormControl.Label>Quickbars</FormControl.Label>
          {parameters?.plugins?.includes("quickbars") ? (
            <TextInput
              name="quickbarsSelectionToolbar"
              id="quickbarsSelectionToolbar"
              value={parameters.quickbarsSelectionToolbar}
              onChange={onInputChange}
            />
          ) : null}

          <FormControl.Label>Format</FormControl.Label>
          <TextInput
            name="formatgroup"
            id="formatgroup"
            value={parameters.formatgroup}
            onChange={onInputChange}
          />
          <FormControl.HelpText>
            Referenced using key 'formatgroup' in the toolbar field
          </FormControl.HelpText>

          <FormControl.Label>Assets</FormControl.Label>
          <TextInput
            name="assetgroup"
            id="assetgroup"
            value={parameters.assetgroup}
            onChange={onInputChange}
          />
          <FormControl.HelpText>
            Handles Contentful assets using `existingasset` for inserting an existing Asset or `newasset` for creating a new Asset. Referenced using key 'assetgroup' in the toolbar field.
          </FormControl.HelpText>
        </FormControl>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
