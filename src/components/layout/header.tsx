import styles from "./header.module.scss";
import {useDispatch, useSelector} from "react-redux";
import configSlice, {ConfigState} from "@/store/configSlice";
import {AppState} from "@/store/store";


export default function Header() {
  const usingDarkMode = useSelector((state: AppState) => state.config.useDarkMode);
  const dispatch = useDispatch();

  return (
    <header className={styles.Header}>
      <input
        type="checkbox"
        checked={usingDarkMode}
        onChange={v => dispatch(configSlice.actions.setDarkMode(v.target.checked))}/>
    </header>
  );
}