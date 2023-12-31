import { observer } from "mobx-react";
import * as React from "react";
import { useTranslation, Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import Collection from "~/models/Collection";
import ConfirmationDialog from "~/components/ConfirmationDialog";
import Text from "~/components/Text";
import useCurrentTeam from "~/hooks/useCurrentTeam";
import useStores from "~/hooks/useStores";
import useToasts from "~/hooks/useToasts";
import { homePath } from "~/utils/routeHelpers";

type Props = {
  collection: Collection;
  onSubmit: () => void;
};

function CollectionDeleteDialog({ collection, onSubmit }: Props) {
  const team = useCurrentTeam();
  const { ui } = useStores();
  const { showToast } = useToasts();
  const history = useHistory();
  const { t } = useTranslation();

  const handleSubmit = async () => {
    const redirect = collection.id === ui.activeCollectionId;

    if (redirect) {
      history.push(homePath());
    }

    await collection.delete();
    onSubmit();
    showToast(t("Collection deleted"), { type: "success" });
  };

  return (
    <ConfirmationDialog
      onSubmit={handleSubmit}
      submitText={t("I’m sure – Delete")}
      savingText={`${t("Deleting")}…`}
      danger
    >
      <>
        <Text type="secondary">
          <Trans
            defaults="Are you sure about that? Deleting the <em>{{collectionName}}</em> collection is permanent and cannot be restored, however all published documents within will be moved to the trash."
            values={{
              collectionName: collection.name,
            }}
            components={{
              em: <strong />,
            }}
          />
        </Text>
        {team.defaultCollectionId === collection.id ? (
          <Text type="secondary">
            <Trans
              defaults="Also, <em>{{collectionName}}</em> is being used as the start view – deleting it will reset the start view to the Home page."
              values={{
                collectionName: collection.name,
              }}
              components={{
                em: <strong />,
              }}
            />
          </Text>
        ) : null}
      </>
    </ConfirmationDialog>
  );
}

export default observer(CollectionDeleteDialog);
