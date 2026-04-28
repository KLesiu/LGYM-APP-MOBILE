import { View, Image, Text } from 'react-native';
import { JSX, useMemo } from 'react';
import LGYMLogo from './../../../assets/logoLGYMNewX.png';
import React from 'react';
import ProfileRank from '../elements/ProfileRank';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  children?: React.ReactNode;
  customClasses?: string;
  viewChange?: (view?: JSX.Element) => void;
  isHeaderShow?: boolean;
}

const Header: React.FC<HeaderProps> = ({ children, customClasses, isHeaderShow }) => {
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();

  const displayName = user?.name || '';
  const userRank = useMemo(() => user?.profileRank, [user]);

  return (
    <View
      style={{ gap: 8 }}
      className={`bg-bgColor h-16 smallPhone:h-14 smallPhone:py-2 px-5 ${
        isHeaderShow ? 'flex' : 'hidden'
      } flex-row justify-between  items-center ${customClasses}`}
    >
      <View className="flex flex-row items-center" style={{ gap: 4 }}>
        <Image className="w-10 h-10" source={LGYMLogo} />
        <View className="flex flex-row" style={{ gap: 4 }}>
          <Text
            className="text-primaryColor font-bold  "
            style={{ fontFamily: 'OpenSans_700Bold' }}
          >
            LGYM
          </Text>
          <Text className="text-fifthColor font-bold  " style={{ fontFamily: 'OpenSans_700Bold' }}>
            APP
          </Text>
        </View>
      </View>

      {children}
      <View className="flex flex-row items-center" style={{ gap: 8 }}>
        {userRank && <ProfileRank rank={userRank} customClasses="h-6 w-6" />}

        <View className="flex flex-row items-center gap-2">
          <View className="flex flex-col">
            <Text
              className="text-textColor text-[10px]"
              style={{ fontFamily: 'OpenSans_400Regular' }}
            >
              {t('auth.welcome')},
            </Text>
            {displayName ? (
              <Text className={`text-xs font-bold`} style={{ fontFamily: 'OpenSans_700Bold' }}>
                {displayName}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
export default Header;
