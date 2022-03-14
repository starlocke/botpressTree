import FolderTree, { testData } from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import './FolderTreeBasic.css';

export default function FolderTreeBasic() {
  const onTreeStateChange = (state: any, event: any) =>
    console.log(state, event);

  return (
    <FolderTree
      className="FolderTreeBasic"
      showCheckbox={false}
      data={testData}
      onChange={onTreeStateChange}
    />
  );
}
