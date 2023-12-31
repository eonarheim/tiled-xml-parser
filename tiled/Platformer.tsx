<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.10.1" name="Platformer" tilewidth="21" tileheight="21" tilecount="900" columns="30">
 <image source="tilemap.png" width="630" height="630"/>
 <tile id="43">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0" y="13" width="21" height="8"/>
  </objectgroup>
 </tile>
 <tile id="105">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0.157146" y="20.7957">
    <polygon points="0,0 -0.157146,-4.9763 4.45248,-12.0479 8.06685,-14.8241 12.7812,-14.6146 16.867,-11.8907 20.7433,-4.92392 20.7957,0.0523821"/>
   </object>
  </objectgroup>
 </tile>
 <tile id="130" type="block">
  <properties>
   <property name="file_to_load" type="file" value="todo.md"/>
   <property name="num_coins" type="int" value="50"/>
   <property name="some_color" type="color" value="#ffff0000"/>
  </properties>
  <objectgroup draworder="index" id="2">
   <object id="1" x="0" y="0" width="21" height="21"/>
  </objectgroup>
 </tile>
 <tile id="361">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0" y="0" width="21" height="11"/>
  </objectgroup>
 </tile>
 <tile id="362">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0" y="0" width="21" height="11"/>
  </objectgroup>
 </tile>
 <tile id="363">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0" y="0" width="21" height="11"/>
  </objectgroup>
 </tile>
 <tile id="364">
  <objectgroup draworder="index" id="2">
   <object id="1" x="0" y="0" width="21" height="11"/>
  </objectgroup>
 </tile>
 <tile id="434">
  <objectgroup draworder="index" id="2">
   <object id="1" x="6" y="4" width="9" height="12"/>
   <object id="2" x="2.82864" y="4.13819">
    <point/>
   </object>
   <object id="3" x="14.3003" y="21.4243">
    <ellipse/>
   </object>
  </objectgroup>
 </tile>
 <tile id="435">
  <animation>
   <frame tileid="434" duration="300"/>
   <frame tileid="435" duration="300"/>
   <frame tileid="436" duration="300"/>
   <frame tileid="437" duration="300"/>
   <frame tileid="438" duration="300"/>
   <frame tileid="439" duration="300"/>
   <frame tileid="463" duration="300"/>
   <frame tileid="464" duration="300"/>
   <frame tileid="465" duration="300"/>
   <frame tileid="466" duration="300"/>
   <frame tileid="467" duration="300"/>
  </animation>
 </tile>
 <tile id="458">
  <objectgroup draworder="index" id="2">
   <object id="1" x="3" y="4" width="17" height="17"/>
  </objectgroup>
 </tile>
</tileset>
