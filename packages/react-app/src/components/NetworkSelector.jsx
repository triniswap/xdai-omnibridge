import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { BridgeContext } from '../contexts/BridgeContext';
import { Web3Context } from '../contexts/Web3Context';
import { DownArrowIcon } from '../icons/DownArrowIcon';
import { networkOptions } from '../lib/constants';

const SelectOption = props => {
  const { onChange, network } = props;
  const { icon, label } = network;

  return (
    <MenuItem onClick={() => onChange(network)} p={0}>
      <Flex transition="0.25s" width="100%">
        <Button
          as="div"
          background="white"
          width="100%"
          justifyContent="flex-start"
          fontWeight="normal"
          _hover={{ background: 'background', color: 'blue.500' }}
          color="grey"
        >
          {icon}
          <Text color="black" ml={2}>
            {label}
          </Text>
        </Button>
      </Flex>
    </MenuItem>
  );
};

const DropdownIndicator = () => {
  return (
    <Flex align="center" justify="center" paddingLeft="15px">
      <DownArrowIcon fontSize={8} color="black" />
    </Flex>
  );
};

const SelectValue = ({ icon, label }) => (
  <Flex px={4} align="center">
    {icon}
    <Text color="black" ml={2} fontWeight="bold">
      {label}
    </Text>
    <DropdownIndicator />
  </Flex>
);

export const NetworkSelector = props => {
  const [localNetwork, setLocalNetwork] = useState(0);
  const { providerChainId, setNetwork } = useContext(Web3Context);
  const { setDefaultToken } = useContext(BridgeContext);

  const updateNetwork = useCallback(
    network => {
      setDefaultToken(network.value);
      setLocalNetwork(network.key);
      setNetwork(network);
      window.localStorage.setItem('chosenNetwork', network.key);
    },
    [setDefaultToken, setNetwork],
  );

  useEffect(() => {
    let storageNetwork = parseInt(
      window.localStorage.getItem('chosenNetwork'),
      10,
    );
    if (isNaN(storageNetwork)) {
      storageNetwork = 0;
    } else {
      storageNetwork %= networkOptions.length;
    }
    updateNetwork(networkOptions[storageNetwork]);
  }, [setNetwork, setDefaultToken, updateNetwork]);

  const onChange = network => {
    updateNetwork(network);
  };

  const currentNetwork = networkOptions[localNetwork];

  useEffect(() => {
    const network = networkOptions.find(n => n.value === providerChainId);
    if (network && localNetwork !== network.key) {
      updateNetwork(network);
    }
  }, [providerChainId, updateNetwork, localNetwork]);

  const selectOptions = networkOptions
    .filter(network => currentNetwork.value !== network.value)
    .map(network => {
      return (
        <SelectOption
          onChange={onChange}
          network={network}
          key={network.key.toString()}
        />
      );
    });

  return (
    <Flex {...props}>
      <Menu>
        <MenuButton
          p={0}
          background="transparent"
          color="grey"
          transition="0.25s"
          _hover={{ color: 'blue.500' }}
        >
          <SelectValue {...currentNetwork} />
        </MenuButton>
        <MenuList
          boxShadow="0 0.5rem 1rem #CADAEF"
          border="none"
          p={0}
          w="auto"
          minW="8rem"
        >
          {selectOptions}
        </MenuList>
      </Menu>
    </Flex>
  );
};
